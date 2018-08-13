
var utils = (function () {
    var _newsBox = myUtils.getEleByClass('box')[0];
    var _newsData = null;
// 第一步：从后台获取数据
    function getDat() {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'data.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
                _newsData = myUtils.toJson(xhr.responseText);
            }
        }
        xhr.send(null);
    }

    // 第二步：把数据渲染到页面上
   /* function giveHTML() {
        var ulArr = _newsBox.getElementsByTagName('ul');
        ulArr = myUtils.toArr(ulArr);//ES6[...ulArr]
        _newsData.forEach(function (item, index) {
            //index是从0到length
            //每一条数据放到那个ul里面，我们在这里，把前四条 一次放到ul里面，后四条再次方到ul里面，这样依次下去
            //index%4对应每一个li的索引（0,1,2,3）
            var {pic, title,height}=item;//对象的结构赋值
            var str = `<li>
            <img src="js/default.gif"  data-img="${pic}" height="${height}" alt="">
            <p>${title}</p>
        </li>`;
            //挨个排会导致长短不齐，长短差距大
            //  var n=index%4;//0 1 2 3
            // ulArr[n].innerHTML+=str;
            // 排序方式换成每次给最矮的那个ul排数据
            getMinUl(ulArr).innerHTML += str;
        })
    }*///有闪屏问题
    // 用创造元素的方法
    function giveHTML() {
        var ulArr = _newsBox.getElementsByTagName('ul');
        ulArr = myUtils.toArr(ulArr);//ES6[...ulArr]
        _newsData.forEach(function (item, index) {
            var {pic, title,height}=item;//对象的结构赋值
            var li=document.createElement('li');
            var str = `
            <img src="js/default.gif"  data-img="${pic}" height="${height}" alt="">
            <p>${title}</p>
        `;

            li.innerHTML=str;
            var temp=getMinUl(ulArr);
                temp.appendChild(li);
        })
    }
// 找个子最低的ul
    function getMinUl(ele) {
        ele.sort((a, b)=> {
            return a.clientHeight - b.clientHeight;
        })
        return ele[0];
    }

// 实现图片的懒加载，我们需要先把图片的真实路径存放到img的自定义属性上，等待后期调用
    function loadImg(ele) {
        if(ele.isLoad)return;
        var pare=ele.parentNode;
        var srcT = document.documentElement.scrollTop;
        var cliH = document.documentElement.clientHeight;
        var tarT = myUtils.offset(pare).myTop;
        if (srcT + cliH > tarT) {
            computed(ele);

        }
    }
function loadAll() {
    var imgArr=_newsBox.getElementsByTagName('img');
    for (var i = 0; i < imgArr.length; i++) {
        loadImg(imgArr[i]);

    }
}
    // 设置链接地址出现
    function computed(ele) {
    var temp = new Image();
    var trueSrc = ele.getAttribute('data-img');
    temp.src=trueSrc;
    temp.onload = function () {
        ele.src = trueSrc;
        ele.isLoad=true;
    }
    temp = null;
}

// 用透明度实现
 /*   function computed(ele) {
        var temp = new Image();
        var trueSrc = ele.getAttribute('data-img');
        temp.onload = function () {
            ele.src = trueSrc;
            ele.isLoad = true;
            fadeIn(ele);
            temp = null;
        }
        temp.src=trueSrc;
    }
function fadeIn(ele) {
    ele.style.opacity=0;
    var opa=0.1;
    var timer=setInterval(function () {
        opa+=0.1;
        ele.style.opacity=opa;
        if(opa>=1){
            ele.style.opacity=1;
            clearInterval(timer);
        }
    },20);
}*/
    // 获取更多数据
function getMore() {
    var ulArr = _newsBox.getElementsByTagName('ul');
    ulArr = myUtils.toArr(ulArr);//ES6[...ulArr]
    var srcT = document.documentElement.scrollTop;
    var cliH = document.documentElement.clientHeight;
    var temp =getMinUl(ulArr);
    var tarT=temp.clientHeight+myUtils.offset(temp).myTop;//最低的ul的高度+ul到body的顶部的距离
    if(srcT+cliH>tarT){
        getDat();//获取数据
        giveHTML()
    }
}
    return {
        init: function () {
            getDat();
            giveHTML();
            loadAll();
            window.onscroll=function () {
                loadAll();
                getMore();
            }
        }
    }
})()
utils.init();
