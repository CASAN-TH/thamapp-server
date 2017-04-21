(function () {
  'use strict';

  // Campaigns controller
  angular
    .module('campaigns')
    .controller('CampaignsController', CampaignsController);

  CampaignsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'campaignResolve', 'MarketplansService'];

  function CampaignsController($scope, $state, $window, Authentication, campaign, MarketplansService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.campaign = campaign;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.acceptcampaign = acceptcampaign;
    vm.receiptscampaign = receiptscampaign;
    vm.readMarketplans = readMarketplans;
    vm.cancelcampaign = cancelcampaign;
    vm.listCampaign = [];
    vm.checkID = checkID;
    vm.isTrueId = false;
    vm.datauser = {};
    vm.mode = 'new';
    function checkID() {
      var id = vm.datauser.identification;
      if (id.length !== 13) return false;
      for (var i = 0, sum = 0; i < 12; i++)
        sum += parseFloat(id.charAt(i)) * (13 - i);
      if ((11 - sum % 11) % 10 !== parseFloat(id.charAt(12)))
        return false;

      vm.isTrueId = true;
      return true;
    }

    function readMarketplans() {
      vm.marketplans = MarketplansService.query(function () {
        vm.marketplans.forEach(function (market) {
          var enddate = new Date(market.enddate),
            start = new Date(market.startdate),
            locale = 'th',
            monthend = enddate.toLocaleString(locale, { month: 'short' }),
            datestart = start.getDate(),
            dateend = enddate.getDate();
          if (datestart < 10) {
            datestart = '0' + datestart;
          }
          if (dateend < 10) {
            dateend = '0' + dateend;
          }
          market.startdate = datestart;
          market.enddate = dateend + ' ' + monthend;
        });
      });
    }
    $scope.readCampaign = function () {
      vm.listCampaign = [];
      vm.listCampaign = vm.campaign.listusercampaign;
      if (vm.listCampaign) {
        vm.listCampaign.forEach(function (accept) {
          var enddate = new Date(accept.acceptcampaigndate.enddate),
            start = new Date(accept.acceptcampaigndate.startdate),
            locale = 'th',
            monthend = enddate.toLocaleString(locale, { month: 'short' }),
            datestart = start.getDate(),
            dateend = enddate.getDate();
          if (datestart < 10) {
            datestart = '0' + datestart;
          }
          if (dateend < 10) {
            dateend = '0' + dateend;
          }
          accept.acceptcampaigndate.startdate = datestart;
          accept.acceptcampaigndate.enddate = dateend + ' ' + monthend;
        });
      }

    };

    vm.editcampaignuser = function (acc) {
      vm.mode = 'edit';
      vm.datauser = acc;
      // console.log(acc.acceptcampaigndate.text);
    };

    vm.removeitem = function (item) {
      var index = vm.campaign.listusercampaign.indexOf(item);
      vm.campaign.listusercampaign.splice(index, 1);
      vm.campaign.$update(successCallback, errorCallback);
      function successCallback(res) {
        if ($window.confirm('ลบรายการรับสิทธิ์เรียบร้อยแล้ว!')) {
          $state.reload();
        }
        // $state.go('campaigns.list');
        // vm.campaign = campaign.query();
      }
      function errorCallback(res) {
        vm.error = res.data.message;
        if (res.data.message === ''){
          if ($window.confirm('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')) {
            $state.reload();
          }
        }
      }
    };

    function cancelcampaign() {
      vm.campaign.statuscampaign = 'closed';
      vm.campaign.$update(successCallback, errorCallback);
      function successCallback(res) {
        $state.go('campaigns.list');
      }
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function receiptscampaign(itm) {
      itm.status = 'receipts';
      vm.campaign.listusercampaign.forEach(function (listusercam) {
        if (listusercam._id === itm._id) {
          listusercam.status = itm.status;
        }
      });
      vm.campaign.$update(successCallback, errorCallback);
      function successCallback(res) {
        $state.reload();
      }
      function errorCallback(res) {
        vm.error = res.data.message;
        if (res.data.message === ''){
          if ($window.confirm('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')) {
            $state.reload();
          }
        }
      }
    }
    function acceptcampaign() {
      // var enddate = new Date(vm.campaign.enddate);
      // var acceptdate = new Date(enddate.getFullYear(), enddate.getMonth(), enddate.getDate() - 2);

      if (vm.mode === 'new') {

        // vm.campaign.listusercampaign.push({
        //   identification: vm.identification,
        //   status: 'accept',
        //   user: vm.authentication.user,
        //   acceptcampaigndate: vm.acceptcampaigndate,
        //   facebook: vm.facebook,
        //   lineid: vm.lineid

        // });
        vm.datauser.status = 'accept';
        vm.datauser.user = vm.authentication.user;
        vm.campaign.listusercampaign.push(vm.datauser);

        vm.campaign.$update(successCallback, errorCallback);


      } else {
        vm.campaign.$update(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (vm.authentication.user.roles[0] === 'admin') {
          vm.identification = '';
          vm.acceptcampaigndate = {};
          vm.facebook = '';
          vm.lineid = '';
          vm.mode = 'new';
          // if ($window.confirm('บันทึกสำเร็จแล้ว!')) {
          //   $state.reload();
          // }
        } else {
          if ($window.confirm('บันทึกสำเร็จแล้ว!')) {
            $state.reload();
            $state.go('usercampaign');
          }
        }

      }
      function errorCallback(res) {
        if (res.data.message === 'Identification is already!' || res.data.message === 'Your identification is Invalid!') {
          if ($window.confirm(res.data.message)) {
            $state.reload();
          }
        }

        if (res.data.message === 'Privilege is full') {
          if ($window.confirm(res.data.message)) {
            $state.reload();
            $state.go('usercampaign');
          }
        }
        if (res.data.message === ''){
          if ($window.confirm('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง')) {
            vm.campaign.listusercampaign.splice(vm.campaign.listusercampaign.lenth - 1, 1);
            $state.reload();
          }
        }

        // if (res.data.message === 'Your identification is Invalid!') {
        //   if ($window.confirm(res.data.message)) {
        //     $state.reload();
        //   }
        // }
      }
    }

    if (vm.campaign.startdate) {
      vm.campaign.startdate = new Date(vm.campaign.startdate);
    }
    if (vm.campaign.enddate) {
      vm.campaign.enddate = new Date(vm.campaign.enddate);
    }
    // Remove existing Campaign
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.campaign.$remove($state.go('campaigns.list'));
      }
    }

    // Save Campaign
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.campaignForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.campaign._id) {
        vm.campaign.$update(successCallback, errorCallback);
      } else {
        vm.campaign.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('campaigns.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
