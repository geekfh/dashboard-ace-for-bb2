define(['backbone'], function() {
    /**
     * 层与层之间不需要关注相互事件
     * 管理器要管理层的 销毁 和 返回事件, 某一层销毁或者返回的时候就要展示上一层
     */
    function LayersMgr() {
        this.arr = [];
        this.cursor = -1; //当前层游标， 从0开始索引
        this.curView = null; //当前指向的view
    }

    _.extend(LayersMgr.prototype, Backbone.Events, {

        reset: function() {
            this.arr = [];
            this.cursor = -1; //当前层游标， 从0开始索引
            this.curView = null; //当前指向的view
        },

        //fireEvent 默认为true，表示触发事件
        bringToFront: function(view, fireEvent) {
            this.attach(view, true, fireEvent === false ? false : true);
        },

        attach: function(view, bringToFront, fireEvent) {
            fireEvent = fireEvent === false ? false : true;
            bringToFront = bringToFront === false ? false : true;

            if (view === this.curView) {
                return;
            }

            var existed = this.isAttached(view);

            //如果不是第一个view，才要考虑层级关系
            if (this.curView) {

                //如果不存在就监听一些事件
                if (!existed) {
                    this.setupOverLayer(view);
                }

                if (bringToFront) {
                    this._hideLayer(this.curView);
                }
            }

            //如果已经存在，要先从容器中干掉，后面再添加到合适位置
            if (existed) {
                // console.log('已经在管理中');
                var existViewIndex = _.indexOf(this.arr, view);
                this.arr.splice(existViewIndex, 1);
            }

            this.cursor++;
            this.curView = view;
            this.arr.splice(this.cursor, 0, view); //插入当前view的后面

            if (bringToFront) {
                this._showLayer(view, fireEvent);
            }
        },

        _hideLayer: function(view) {
            view && (view.hide ? view.hide() :
                view.$el ? view.$el.hide() : null);
        },

        _showLayer: function(view, fireEvent) {
            if(!view) {
                return;
            }
            (view.show ? view.show() :
                view.$el ? view.$el.show() : null);

            if(fireEvent !== false) {
                this.trigger('bring:to:front', view);
            }
        },

        //移除view的管理
        detachLayer: function(view) {
            if (!this.isAttached(view)) {
                return;
            }

            // console.log('移除前', this);

            //更新指向, 要先更新状态，避免索引出错误，别手贱
            //如果是当前层, 游标前移
            if (view === this.curView) {
                this.moveForward();
            }

            _.remove(this.arr, view);

            // console.log('移除后', this);
        },

        isAttached: function(view) {
            return _.indexOf(this.arr, view) !== -1;
        },

        //游标前移,更新当前view
        moveForward: function() {
            this.cursor--;
            this.curView = this.arr[this.cursor];
            this._showLayer(this.curView);
        },

        setupOverLayer: function(view) {
            // console.log('setup', view);
            var me = this,
                preLayer;

            //TODO
            view.on('destroy', function() {
                // console.log('destroy');
                me.detachLayer(view);

                //移除该层
            });

            view.on('back', function() {
                // console.log('返回', this);

                if (me.isAttached(view)) {
                    // console.log('返回层');
                    me._hideLayer(view);
                    me.moveForward();
                } else {
                    // console.log('该层之前已经销毁脱管');
                }
            });
        }
    });



    return LayersMgr;
});