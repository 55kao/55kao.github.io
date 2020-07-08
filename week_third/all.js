new Vue({
  el: '#app',
  data: {
    products: [
      {
        id: 1586934917210,
        title: '網美甜甜圈',
        category: '甜點',
        content: '吃了會讓人變成網美的甜甜圈',
        description: '糖霜、麵粉、任何會導致肥胖的東西',
        imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
        enabled: false,
        origin_price: 100,
        price: 80,
        unit: '個',

      },
      {
        id: 1196934917910,
        title: '起士蛋糕',
        category: '甜點',
        content: '吃了會變滿足身心靈的蛋糕',
        description: '雞蛋、麵粉、奶油',
        imageUrl: 'https://images.unsplash.com/photo-1508737804141-4c3b688e2546?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
        enabled: true,
        origin_price: 120,
        price: 90,
        unit: '個',
      }
    ],
    temp: {},
  },
  methods: {
    editProduct(status, item) {
      if (status === "edit") {
        this.temp = Object.assign({}, item);
        $('#productFrom').modal('show');
      }
      if (status === "new") {
        this.temp = {}
        $('#productFrom').modal('show');
      }
      if (status === "delete") {
        this.temp = Object.assign({}, item);
        $('#deleteModal').modal('show');
      }
    },
    addProduct() {
      let tempId = this.temp.id
      if (tempId) {
        this.products.forEach((item, i) => {
          if (tempId === item.id) {
            this.products[i] = this.temp
            this.$set(this.products[i], i, this.temp)
          }
        });
      }
      else {
        console.log(this.temp)
        tempId = new Date().getTime();
        this.temp.id = tempId;
        this.products.push(this.temp)
      }
      this.temp = {};
      $('#productFrom').modal('hide');
    },
    deleteProduct() {
      this.products.forEach((item, i) => {
        if (item.id === this.temp.id) {
          this.products.splice(i, 1)
        }
      })
      this.temp = {}
      $('#deleteModal').modal('hide');
    }

  }
})
