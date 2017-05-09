define(function() {

    var User = Backbone.Model.extend({

      isExplorer: function () {
        return this.get('isExplorer') == 1;
      },

      canEditExplorer: function () {
        return this.get('brhLevel') == 1;
      },

      parse: function (data) {
        if(data.isPswChanged !== void 0) {
          data.isPswChanged = parseInt(data.isPswChanged, 10) === 0 ? false : true;
        }
        data.brhLevel = parseInt(data.brhLevel, 10);
        data.ruleType = parseInt(data.ruleType, 10);
        return data;
      },

      defaults: {
        // id: 1,
        // code: '',
        // name: '',
        // loginName: '',
        // roleGroupName: '', // Role Group Name
        // ruleName: '',      // Role Group Name
        // isExplorer: '0',   // 0-非拓展员  1-拓展员
        // gender: '0',       // 0-男  1-女,
        // status: '0',       // 0-正常 1-停用,
        // registerDate: '',  //
        // tel: '',           //电话
        // mobile: '',
        // email: ''
      }

    });

    var Users = Backbone.Collection.extend({
      // url: url._('users'),
      model: User
    });

    Users.Model = User;

    return Users;

});

