define(function() {

    var _id = 1;
    function nextQueueId () {
        return _id++;
    }

    var iframeCount = 0;
    Uploader = function (options) {
        if (!(this instanceof Uploader)) {
            return new Uploader(options);
        }
        if (isString(options)) {
            options = {
                trigger: options
            };
        }
        var settings = {
            trigger: null,
            name: null,
            action: null,
            data: null,
            accept: null,
            change: null,
            error: null,
            multiple: false,
            success: null
        };
        var xhrForAbort;
        if (options) {
            $.extend(settings, options);
        }
        var $trigger = $(settings.trigger);
        settings.action = settings.action || $trigger.data("action") || "/upload";
        settings.name = settings.name || $trigger.attr("name") || $trigger.data("name") || "file";
        settings.data = settings.data || parse($trigger.data("data"));
        settings.accept = settings.accept || $trigger.data("accept");
        settings.success = settings.success || $trigger.data("success");
        this.settings = settings;
        this.uploadMap = {};
        this.setup();
        this.bind();
    };

    Uploader.prototype._afterComplete = function () {
        this.refreshInput();
    };

    // initialize
    // create input, form, iframe
    Uploader.prototype.setup = function() {
        this.form = $('<form class="upload-form" method="post" enctype="multipart/form-data"' + 'target="" action="' + this.settings.action + '" />').on('submit', function(e){e.stopPropagation();});
        this.iframe = newIframe();
        this.form.attr("target", this.iframe.attr("name"));
        var data = this.settings.data;
        this.form.append(createInputs(data));
        if (window.FormData) {
            this.form.append(createInputs({
                _uploader_: "formdata"
            }));
        } else {
            this.form.append(createInputs({
                _uploader_: "iframe"
            }));
        }
        var input = document.createElement("input");
        input.className = 'uploader-file-input';
        input.type = "file";
        input.name = this.settings.name;
        if (this.settings.accept) {
            input.accept = this.settings.accept;
        }
        if (this.settings.multiple) {
            input.multiple = true;
            input.setAttribute("multiple", "multiple");
        }
        
        this.input = $(input);
        var $trigger = $(this.settings.trigger);
        this.input.attr("hidefocus", true).css({
            position: "absolute",
            width: '100%',
            height: '100%',
            top: 0,
            right: 0,
            opacity: 0,
            outline: 0,
            cursor: "pointer",
            // height: $trigger.outerHeight(),
            fontSize: Math.max(64, $trigger.outerHeight() * 5)
        });
        this.form.append(this.input);

        this.form.css({
            position: "absolute",
            overflow: "hidden",
            // top: $trigger.offset().top,
            // left: $trigger.offset().left,
            top: 0,
            left:0,
            width: '100%',//$trigger.outerWidth(),
            height: '100%',//$trigger.outerHeight(),
            zIndex: findzIndex($trigger) + 10
        }).appendTo($trigger);//.appendTo("body");
        return this;
    };
    
    // bind events
    Uploader.prototype.bind = function() {
        var self = this;
        var $trigger = $(self.settings.trigger);
        // $trigger.mouseenter(function() {
        //     self.form.css({
        //         top: $trigger.offset().top,
        //         left: $trigger.offset().left,
        //         width: $trigger.outerWidth(),
        //         height: $trigger.outerHeight()
        //     });
        // });
        self.bindInput();
    };

    Uploader.prototype.bindInput = function() {
        var self = this;
        self.input.change(function(e) {
            // ie9 don't support FileList Object
            // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
            self._files = this.files || [ {
                name: e.target.value
            } ];
            var file = self.input.val();
            if (self.settings.change) {
                self.settings.change.call(self, self._files);
            } else if (file) {
                return self.submit();
            }
        });
    };

    Uploader.prototype.setData = function (data) {
        var unsetup = {};
        var $form = $(this.form);
        var $input;
        for(var key in data) {
            $input = $form.find('[name="' + key + '"]');
            if($input.length) {
                $input.val(data[key]);
            }else {
                unsetup[key] = data[key];
            }
        }
        this.form.append(createInputs(unsetup));
    };

    Uploader.prototype.getFilename = function () {
        return this.input.val();
    };

    // handle submit event
    // prepare for submiting form
    Uploader.prototype.submit = function() {
        var self = this;
        var queueId = nextQueueId();

        if(self.settings.beforeSubmit && self.settings.beforeSubmit.call(self, queueId) === false) {
            return false;
        }

        var queueObj = this.uploadMap[queueId] || (this.uploadMap[queueId] = {});

        if (window.FormData && self._files) {
            // build a FormData
            var form = new FormData(self.form.get(0));
            // use FormData to upload
            form.append(self.settings.name, self._files);
            // fix the progress target file
            var files = self._files;
            var optionXhr = function() {
                var xhr = $.ajaxSettings.xhr();
                if (self.settings.progress && xhr.upload) {
                    xhr.upload.addEventListener("progress", function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        /*event.position is deprecated*/
                        var total = event.total;
                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }
                        self.settings.progress(queueId, event, position, total, percent, files);
                    }, false);
                }
                return xhr;
            };
            
            var xhrForAbort = self.xhrForAbort = $.ajax({
                ignoreBsError: true,
                autoMsg: false,
                dataType: 'json',
                url: self.settings.action,
                type: "post",
                processData: false,
                contentType: false,
                data: form,
                xhr: optionXhr,
                context: this,
                complete: function ( jqXHR, textStatus) {
                    self.settings.complete && self.settings.complete.call(null, queueId);
                    self._afterComplete();
                },
                success: function (resp, textStatus, jqXHR) {
                    self.settings.success && self.settings.success.call(null, queueId, resp);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    self.settings.error && self.settings.error.call(null, queueId);
                }
            });

            queueObj.abort = function () {
                xhrForAbort.abort && xhrForAbort.abort();
            };


            return this;
        } else {
            // iframe upload
            var iframe = self.iframe = newIframe();
            self.form.attr("target", self.iframe.attr("name"));
            $("body").append(self.iframe);
            self.iframe.one("load", function() {
                // https://github.com/blueimp/jQuery-File-Upload/blob/9.5.6/js/jquery.iframe-transport.js#L102
                // Fix for IE endless progress bar activity bug
                // (happens on form submits to iframe targets):
                $('<iframe src="javascript:false;"></iframe>').appendTo(self.form).remove();
                var response = $(this).contents().find("body").text();
                try{
                    response = JSON.parse(response);
                }catch(e) {
                    console.log('iframe获取响应内容无法解析称json');
                }
                $(this).remove();
                if (!response) {
                    if (self.settings.error) {
                        self.settings.error(queueId);
                    }
                } else {
                    if (self.settings.success) {
                        self.settings.success(queueId, response);
                    }
                }
                if (self.settings.complete) {
                    self.settings.complete(queueId, response);
                }
                self._afterComplete();

                queueObj.abort = function () {
                    iframe && iframe.attr('src', '');
                };
            });

            self.form.submit();
        }
        return this;
    };
    Uploader.prototype.refreshInput = function() {
        //replace the input element, or the same file can not to be uploaded
        var newInput = this.input.clone().val('');
        this.input.before(newInput);
        this.input.off("change");
        this.input.remove();
        this.input = newInput;
        this.bindInput();
    };
    // handle change event
    // when value in file input changed
    Uploader.prototype.change = function(callback) {
        if (!callback) {
            return this;
        }
        this.settings.change = callback;
        return this;
    };
    // handle when upload success
    Uploader.prototype.success = function(callback) {
        var me = this;
        this.settings.success = function(response) {
            me.refreshInput();
            if (callback) {
                callback(response);
            }
        };
        return this;
    };
    // handle when upload success
    Uploader.prototype.error = function(callback) {
        var me = this;
        this.settings.error = function(response) {
            if (callback) {
                me.refreshInput();
                callback(response);
            }
        };
        return this;
    };
    // abort 
    Uploader.prototype.abort = function(queueId){
        if(!queueId) {
            if (window.FormData && this._files) {
                this.xhrForAbort && this.xhrForAbort.abort();
            } else {
                this.iframe.attr('src', '');
            }
            // Opf.alert({ title: 'upload abort ', message: '已中止上传' });
        }else {
            var uploadMap = this.uploadMap;
            uploadMap[queueId] && uploadMap[queueId].abort && uploadMap[queueId].abort();
        }
        // Opf.alert({ title: 'upload abort ', message: '已中止上传' });
    };
    // enable
    Uploader.prototype.enable = function() {
        this.input.prop("disabled", false);
    };
    // disable
    Uploader.prototype.disable = function() {
        this.input.prop("disabled", true);
    };
    // Helpers
    // -------------
    function isString(val) {
        return Object.prototype.toString.call(val) === "[object String]";
    }
    function createInputs(data) {
        if (!data) return [];
        var inputs = [], i;
        for (var name in data) {
            i = document.createElement("input");
            i.type = "hidden";
            i.name = name;
            i.value = data[name];
            inputs.push(i);
        }
        return inputs;
    }
    function parse(str) {
        if (!str) return {};
        var ret = {};
        var pairs = str.split("&");
        var unescape = function(s) {
            return decodeURIComponent(s.replace(/\+/g, " "));
        };
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            var key = unescape(pair[0]);
            var val = unescape(pair[1]);
            ret[key] = val;
        }
        return ret;
    }
    function findzIndex($node) {
        var parents = $node.parentsUntil("body");
        var zIndex = 0;
        for (var i = 0; i < parents.length; i++) {
            var item = parents.eq(i);
            if (item.css("position") !== "static") {
                zIndex = parseInt(item.css("zIndex"), 10) || zIndex;
            }
        }
        return zIndex;
    }
    function newIframe() {
        var iframeName = "iframe-uploader-" + iframeCount;
        var iframe = $('<iframe name="' + iframeName + '" />').hide();
        iframeCount += 1;
        return iframe;
    }
    function MultipleUploader(options) {
        if (!(this instanceof MultipleUploader)) {
            return new MultipleUploader(options);
        }
        if (isString(options)) {
            options = {
                trigger: options
            };
        }
        var $trigger = $(options.trigger);
        var uploaders = [];
        $trigger.each(function(i, item) {
            options.trigger = item;
            uploaders.push(new Uploader(options));
        });
        this._uploaders = uploaders;
    }
    MultipleUploader.prototype.submit = function() {
        $.each(this._uploaders, function(i, item) {
            item.submit();
        });
        return this;
    };
    MultipleUploader.prototype.change = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.change(callback);
        });
        return this;
    };
    MultipleUploader.prototype.success = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.success(callback);
        });
        return this;
    };
    MultipleUploader.prototype.abort = function() {
        $.each(this._uploaders, function(i, item) {
            item.abort();
        });
        return this;
    };
    MultipleUploader.prototype.error = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.error(callback);
        });
        return this;
    };
    MultipleUploader.prototype.enable = function() {
        $.each(this._uploaders, function(i, item) {
            item.enable();
        });
        return this;
    };
    MultipleUploader.prototype.disable = function() {
        $.each(this._uploaders, function(i, item) {
            item.disable();
        });
        return this;
    };
    MultipleUploader.Uploader = Uploader;


    return Uploader;
});
