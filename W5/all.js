// 掛載 Vue-Loading 套件
Vue.use(VueLoading);
// 全域註冊 VueLoading 並標籤設定為 loading
Vue.component("loading", VueLoading);

// 將 VeeValidate input 驗證工具載入 作為全域註冊
Vue.component("ValidationProvider", VeeValidate.ValidationProvider);

// 將 VeeValidate 完整表單 驗證工具載入 作為全域註冊
Vue.component("ValidationObserver", VeeValidate.ValidationObserver);

// Class 設定檔案
VeeValidate.configure({
  classes: {
    valid: "is-valid",
    invalid: "is-invalid",
  },
});

new Vue({
  el: "#app",
  data: {
    api: {
      path: "https://course-ec-api.hexschool.io/api/",
      uuid: "e44cffb9-2103-484f-8958-dc84de83d323",
    },
    status: {
      loadingItem: "",
    },
    isLoading: false,
    rowProductData: [],
    itemInCar: [],
    dataDetail: [],
    cartTotal: 0,
    formData: {
      name: "",
      email: "",
      tel: "",
      address: "",
      payment: "",
      message: "",
    },
    paymentOptions: [
      "WebATM",
      "ATM",
      "CVS",
      "Barcode",
      "Credit",
      "ApplePay",
      "GooglePay",
    ],
  },
  methods: {
    //取得所有產品資訊
    getData() {
      const getApi = `${this.api.path}${this.api.uuid}/ec/products`;
      axios
        .get(getApi)
        .then((response) => {
          console.log(response);
          this.rowProductData = response.data.data;
          console.log(this.rowProductData);
          this.getShoppingData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    itemDetail(id) {
      this.status.loadingItem = id;
      const dataDetaillUrl = `${this.api.path}${this.api.uuid}/ec/product/${id}`;
      axios
        .get(dataDetaillUrl)
        .then((response) => {
          this.dataDetail = response.data.data;
          this.$set(this.dataDetail, "num", 0); //參考範例程式碼
          $("#dataDetailModal").modal("show");
          console.log(response);
          this.status.loadingItem = "";
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 加入購物車
    addCart(id, num) {
      this.status.loadingItem = id;
      this.isLoading = true;
      let temp = { product: id, quantity: num.toString() };
      const addApi = `${this.api.path}${this.api.uuid}/ec/shopping`;
      axios
        .post(addApi, temp)
        .then((response) => {
          console.log(response);
          this.status.loadingItem = "";
          this.getShoppingData();
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err);
          console.log(err);
          this.isLoading = false;
        });
    },
    // 取得所有購物車資料
    getShoppingData() {
      this.isLoading = true;
      const carApi = `${this.api.path}${this.api.uuid}/ec/shopping`;
      axios
        .get(carApi)
        .then((response) => {
          this.cartTotal = 0;
          console.log(response.data.data);
          response.data.data.forEach((i) => {
            this.cartTotal += i.product.price * i.quantity;
          });
          console.log(this.cartTotal);
          this.itemInCar = response.data.data;
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 更新產品數量
    quantityUpdate(itemId, itemQuantity) {
      this.isLoading = true;
      let temp = { product: itemId, quantity: itemQuantity };
      const updateUrl = `${this.api.path}${this.api.uuid}/ec/shopping`;
      axios
        .patch(updateUrl, temp)
        .then((response) => {
          console.log(response);
          this.isLoading = false;
          this.getShoppingData();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 刪除單筆購物車資料
    delOneItem(item) {
      this.isLoading = true;
      const delApi = `${this.api.path}${this.api.uuid}/ec/shopping/${item.product.id}`;
      axios
        .delete(delApi)
        .then((response) => {
          console.log(response);
          this.getShoppingData();
          alert(response.data.message);
        })
        .catch((err) => {
          alert(err.data.message);
          console.log(err);
        });
    },
    // 刪除全部購物車資料
    deleteAll() {
      this.isLoading = true;
      const deleteUrl = `${this.api.path}${this.api.uuid}/ec/shopping/all/product`;
      axios
        .delete(deleteUrl)
        .then((response) => {
          console.log(response);
          this.getShoppingData();
          alert(response.data.message);
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err.data.message);
          console.log(err);
        });
    },
    submitForm() {
      this.isLoading = true;
      const orderApi = `${this.api.path}${this.api.uuid}/ec/orders`;
      axios
        .post(orderApi, this.formData)
        .then((response) => {
          console.log(response);
          if (response.data.data.id) {
            this.isLoading = false;
            // 跳出提示訊息
            $("#orderModal").modal("show");

            // 重新渲染購物車
            this.getShoppingData();
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err.response.data.errors);
        });
    },
  },
  created() {
    this.getData();
  },
});
