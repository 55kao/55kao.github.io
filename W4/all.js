import pagination from "./pagination.js";

Vue.component("pagination", pagination);

new Vue({
  el: "#app",
  data: {
    apiPath: "https://course-ec-api.hexschool.io/api/",
    token: "",
    user: {
      token: "",
      uuid: "e44cffb9-2103-484f-8958-dc84de83d323",
    },
    products: [],
    pagination: [],
    temp: {
      imageUrl: [],
    },
  },
  methods: {
    editProduct(status, item) {
      if (status === "edit") {
        // 編輯單筆
        // 先遠端取得單筆資料
        let tempId = item.id;
        const url = `${this.apiPath}${this.user.uuid}/admin/ec/product/${tempId}`;
        axios
          .get(url)
          .then((response) => {
            console.log(response);
            this.temp = response.data.data;
          })
          .catch((err) => {
            console.log(err);
          });
        $("#productFrom").modal("show");
      }
      if (status === "new") {
        this.temp = {
          imageUrl: [],
        };
        $("#productFrom").modal("show");
      }
      if (status === "delete") {
        this.temp = Object.assign({}, item);
        $("#deleteModal").modal("show");
      }
    },
    submit() {
      let tempId = this.temp.id;
      if (tempId) {
        // 編輯
        const editApi = `${this.apiPath}${this.user.uuid}/admin/ec/product/${tempId}`;
        axios
          .patch(editApi, this.temp)
          .then((response) => {
            console.log("edit success", response);
            this.getData();
            $("#productFrom").modal("hide");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        // 新增
        tempId = new Date().getTime();
        this.temp.id = tempId;
        if (
          this.temp.title != "" &&
          this.temp.category != "" &&
          this.temp.description != "" &&
          this.temp.imageUrl != []
        ) {
          const addNewApi = `${this.apiPath}${this.user.uuid}/admin/ec/product`;
          axios
            .post(addNewApi, this.temp)
            .then((response) => {
              console.log(response);
              this.getData();
              $("#productFrom").modal("hide");
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    },
    // 刪除
    deleteProduct() {
      const deleteApi = `${this.apiPath}${this.user.uuid}/admin/ec/product/${this.temp.id}`;
      axios
        .delete(deleteApi)
        .then((response) => {
          console.log(response);
          this.temp = {
            imageUrl: [],
          };
          this.getData();
          alert("刪除成功！");
          $("#deleteModal").modal("hide");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getData(num) {
      if (!num) {
        num = 1;
      }
      const getApi = `${this.apiPath}${this.user.uuid}/admin/ec/products?page=${num}`;
      axios
        .get(getApi)
        .then((response) => {
          this.products = response.data.data;
          this.pagination = response.data.meta.pagination;
          console.log("getdata");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.user.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)loginInfo\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // 將 Token 加入到 Headers 內
    axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
    // 若無法取得 token 則返回 Login 頁面
    if (this.user.token === "") {
      window.location = "Login.html";
    }
    this.getData();
  },
});
