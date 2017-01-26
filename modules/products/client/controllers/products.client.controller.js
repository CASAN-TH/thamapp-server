(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'productResolve', 'FileUploader', '$timeout', 'ShopCartService', 'ProductsService', 'PromotionsService'];

  function ProductsController($scope, $state, $window, Authentication, product, FileUploader, $timeout, ShopCartService, ProductsService, PromotionsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.product = product;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.readProduct = readProduct;
    vm.cart = ShopCartService.cart;
    vm.addRangType = addRangType;
    vm.removeRangType = removeRangType;
    var rangType = {
      min: '',
      max: '',
      value: ''
    };
    if (vm.product.rangtype2) {
      vm.product.rangtype2 = vm.product.rangtype2;
    } else {
      vm.product.rangtype2 = [];
    }
    if (!vm.product.rangtype2.length) {
      vm.product.rangtype2.push(rangType);
    }
    vm.buynow = function (product) {
      $timeout(function () {
        vm.cart.add(product);
        $state.go('cartview');
      }, 400);

    };
    vm.moreCart = moreCart;
    vm.viewCart = function () {
      $timeout(function () {
        $state.go('cartview');
      }, 400);

    };
    function addRangType() {
      rangType = {
        min: '',
        max: '',
        value: ''
      };
      vm.product.rangtype2.push(rangType);
    }

    function removeRangType(index) {
      vm.product.rangtype2.splice(index, 1);
    }

    // พี่โก๋ยกเลิกการ readPromotion แบบเก่า
    // ข้อมูล Promotions จะอ่านมาอยู่ในข้อมูล Product อยู่แล้ว
    //vm.readPromotion = readPromotion;
    // function readPromotion() {
    //   vm.promotion = PromotionsService.query();
    // }

    $scope.user = Authentication.user;
    function readProduct() {
      vm.products = ProductsService.query();
    }

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/products_picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.product.images = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      // $scope.user = Authentication.user = response;
      vm.product.images = response.imageURL;
      console.log(response);

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.product._id) {
        vm.product.$update(successCallback, errorCallback);
      } else {
        vm.product.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('products.view', {
          productId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }


    }

    function moreCart(product) {
      $timeout(function () {
        vm.product = product;
        $state.go('products.list');
      }, 400);
    }
  }
} ());
