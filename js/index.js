// {function UIGoods(g){
//     this.data = g;
//     this.choose = 3;
// }
// //总价
// UIGoods.prototype.getTotalPrice = function(){
//     return this.data.price * this.choose
// }
// //选中商品
// UIGoods.prototype.isChoose = function(){
//     return this.choose > 0;
// }}

class UIGoods{
    constructor(g){
        this.data = g;
        this.choose = 0;
    }
    //总价
    getTotalPrice(){
        return this.data.price * this.choose;
    }
    //选中
    isChoose(){
        return this.choose > 0;
    }
    //增加
    increase(){
        this.choose++;
    }
    //减少
    decrease(){
        if(this.choose === 0){
            return ;
        }
        this.choose--;
    }
}
// var Goods = new UIGoods();
//整个界面的数据
class UIData{
    constructor(){
        var uiGoods = [];
        for(var i = 0;i<goods.length;i++){
            var uig = new UIGoods(goods[i]);
            uiGoods.push(uig);
        }
       this.uiGoods = uiGoods;
       this.deliveryThreshold = 60;
       this.deliverPrice = 5;
    }
    //总价
    getTotalPrice(){
        var sum = 0;
        for(var i = 0;i < this.uiGoods.length;i++){
            var g = this.uiGoods[i];
            sum += g.getTotalPrice();
        }
        return sum;
    }
    //增加
    increase(index){
        this.uiGoods[index].increase();
    }
    //减少
    decrease(index){
        this.uiGoods[index].decrease();
    }
    //数量
    getTotalChooseNumber(){
        var num = 0;
        for(var i = 0;i < this.uiGoods.length;i++){
            num+=this.uiGoods[i].choose;
        }
        return num;
    }
    //购物车有没有东西
    hasGoodsInCar(){
        return this.getTotalChooseNumber() > 0;
    }
    //起送标准
    isCrossDeliveryThreshold(){
        return this.getTotalPrice() >= this.deliveryThreshold;
    }
    //
    isChoose(index){
        return this.uiGoods[index].isChoose();
    }
}
var uiData = new UIData();
//界面
class UI {
    constructor(){
        this.uiData = new UIData();
        this.doms = {
            goodsContainer:document.querySelector('.goods-list'),
            deliverPrice:document.querySelector('.footer-car-tip'),
            footerPay:document.querySelector('.footer-pay'),
            footerPayInnerSpan:document.querySelector('.footer-pay span'),
            totalPrice:document.querySelector('.footer-car-total'),
            car:document.querySelector('.footer-car'),
            badge:document.querySelector('.footer-car-badge'),
        };
        var carRect = this.doms.car.getBoundingClientRect();
        var jumpTarget = {
            x:carRect.left + carRect.width / 2,
            y:carRect.top + carRect.height / 5
        }
        this.jumpTarget = jumpTarget;
        this.createHTML();
        this.upDataFooter();
        this.listenEvent();
    }

    //监听事件
    listenEvent(){
        this.doms.car.addEventListener('animationend',function(){
            this.classList.remove('animate')
        })
    }
    //渲染
    createHTML(){
        var html = '';
        for(var i = 0;i < this.uiData.uiGoods.length;i++){
            var g = this.uiData.uiGoods[i];
            html +=`<div class="goods-item">
            <div class="goods-Info">
                <h2 class="goods-title">${g.data.title}</h2>
                <p class="goods-sell">
                    <span>月售 ${g.data.sellNumber}</span>
                    <span>好评 ${g.data.favorRate}</span>
                </p>
                <div class="goods-confirm">
                    <p class="goods-price">
                        <span class="goods-price-unit">￥</span>
                        <span>${g.data.price}</span>
                    </p>
                    <div class="goods-btn">   
                        <i index="${i}" class="iconfont icon-jian"></i>  
                        <span>${g.choose}</span>               
                        <i index="${i}" data-op="changeNumber" class="iconfont icon-jiahao"></i>
                    </div>
                </div>
            </div>
        </div>`
        }
        this.doms.goodsContainer.innerHTML = html;
    }
    //增加
    increase(index){
        this.uiData.increase(index)
        this.upDataGoodsItem(index)
        this.upDataFooter(index)
        this.jump(index)
    }
    //减少
    decrease(index){
        this.uiData.decrease(index)
        this.upDataGoodsItem(index)
        this.upDataFooter(index)
    }
    //更新商品
    upDataGoodsItem(index){
        var goodsDom = this.doms.goodsContainer.children[index]
        if(this.uiData.isChoose){
            goodsDom.classList.add('active');
            console.log(11);
        }else{
            goodsDom.classList.remove('active')
        }
        var span = goodsDom.querySelector('.goods-btn span')
        span.textContent = this.uiData.uiGoods[index].choose;
    }
    //更新页脚
    upDataFooter(){
        //总价
        var total = this.uiData.getTotalPrice();
        this.doms.deliverPrice.textContent = `配送费￥${this.uiData.deliverPrice}`;
        if(this.uiData.isCrossDeliveryThreshold()){
            this.doms.footerPay.classList.add('active')
            this.doms.footerPayInnerSpan.textContent = `还差0元起送`
        }else{
            this.doms.footerPay.classList.remove('active');
            var dis = this.uiData.deliveryThreshold - total;
            dis = Math.round(dis);
            this.doms.footerPayInnerSpan.textContent = `还差${dis}元起送`
        }
        //设置总价
        this.doms.totalPrice.textContent = total.toFixed(2);
        //购物车样式
        if(this.uiData.hasGoodsInCar()){
            this.doms.car.classList.add('active')
        }else{
            this.doms.car.classList.remove('active')
        }
        //购物车数量
        this.doms.badge.textContent = this.uiData.getTotalChooseNumber();
    }

    //购物车动画
    carAnimate(){
        this.doms.car.classList.add('animate')
    }
    //抛物线跳跃元素
    jump(index){
       var btnAdd = this.doms.goodsContainer.children[index].querySelector('.icon-jiahao');
       var rect = btnAdd.getBoundingClientRect();
       var start = {
        x:rect.left,
        y:rect.top,
       };

       //跳
       var div = document.createElement('div');
       var i = document.createElement('i')
       div.className = 'add-to-car';
       i.className = 'iconfont icon-jiahao';
       //初始位置
       div.style.transform = `translateX(${start.x}px`;
       i.style.transform = `translateY(${start.y}px)`
       div.appendChild(i);
       document.body.appendChild(div);
       //q强行渲染
       div.clientWidth;
       //结束位置
       div.style.transform = `translateX(${this.jumpTarget.x}px)`;
       i.style.transform = `translateY(${this.jumpTarget.y}px)`;

       var that = this;
       div.addEventListener('transitionend',function(){
        div.remove();
        that.carAnimate();
       },
       {
        once:true
       }
       )
    }
}
var  ui = new UI();
//事件
ui.doms.goodsContainer.addEventListener('click',function(e){
    if(e.target.classList.contains('icon-jiahao'))
    {
        var index = +e.target.getAttribute('index');
        ui.increase(index)
    }else if(e.target.classList.contains("icon-jian")){
        var index = +e.target.getAttribute('index');
        ui.decrease(index)
    }
})
