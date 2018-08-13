/**
 * Created by Administrator on 2018/8/9.
 */
var utils = (function () {
    var getCss = function (curEle, attr) {
        var value = null;
        try {
            value = window.getComputedStyle(curEle, null)[attr];

        } catch (e) {
            value = curEle.currentStyle[attr];
        }
        //判断value是否是数字加单位的类型
        var reg = /^([+-]?(\d|[1-9]\d+)(\.\d+)?)(px|rem|em|pt)$/;
        if (reg.test(value)) {
            value = parseFloat(value);
        }
        return value;
    }
    var setCss = function (ele, attr, value) {
        var reg = /width|height|left|top|margin|padding|border|fontSize|marginTop/i;
        if (reg.test(attr)) {
            value = parseFloat(value) + 'px';
        }
        ele.style[attr] = value;//=>没有单位的时候可能会报错
    }
    var setGroup = function (ele, obj) {
        if (Object.prototype.toString.call(obj) !== '[object Object]') {
            return;
        }
        for (var k in obj) {//=>原型上自定义的私有属性也可以获取到
            if (obj.hasOwnProperty(k)) {
                setCss(ele, k, obj[k]);
            }
        }
    }
    // 将三种方法组合封装
    var css = function () {
        var arg = arguments;
        if (arg.length == 2) {
            if (typeof arg[1] == 'string') {
                return getCss(arg[0], arg[1]);
            } else {
                setGroup(arg[0], arg[1]);
            }
        } else {
            setCss(arg[0], arg[1], arg[2]);
        }
    }
    //捕获所有的正则匹配的内容 //通过跟原型绑定使用
    var execAll = function (str) {
        var arr = [];
        var temp = this.exec(str);
        if (!this.global) {
            // throw error= '你没加全局修饰符g';
            temp = temp || {};//防止获取的是null，null不能设置属性
            temp.error = '你没加全局修饰符g';
            return temp;
        }
        while (temp) {
            arr.push(temp[0]);
            temp = this.exec(str)
        }
        return arr;
    }
    //获取元素的元素子节点，以及制定标签名的节点
    var children = function (ele, tagName) {
        var result = [];
        var childList = ele.childNodes;
//        chlidList = myUtils.toArr(childList);
        for (var i = 0; i < childList.length; i++) {
            var item = childList[i];
            if (item.nodeType === 1) {
                if (typeof tagName !== 'undefined') {
                    if (item.tagName.toLowerCase() === tagName.toLowerCase()) {
                        result.push(item);
                    }
                    continue;
                }
                result.push(item)
            }
        }
        return result;
    }
    // 求元素外边框距离body的的距离（left，top）
    var offset = function (ele) {
        var myLeft = ele.offsetLeft;//先保存元素外边框到上级参照物的内边框的距离
        var myTop = ele.offsetTop;
        var temp = ele.offsetParent;//用temp去存储上级参照物
        while (temp && temp.nodeName.toLowerCase() !== 'body') {
            //判断上级参照物是不是存在，不存在的话说明ele就是body
            //如果存在，并且不是body，就按着向上累加offset值
            myLeft += temp.offsetLeft + temp.clientLeft;
            myTop += temp.offsetTop + temp.clientTop;
            temp = temp.offsetParent;
        }
        return {
            myLeft: myLeft,
            myTop: myTop
        }
    }
    // 将json字符串转化成json
    var toJson = function (str) {
        try {
            var arr = JSON.parse(str);
            return arr;
        } catch (e) {
            var arr = eval('(' + str + ')');
            return arr;
        }
    }
    // 将类数组转化成数组
    var toArr = function (ary) {
        try {
            var arr = [];
            arr = Array.prototype.slice.call(ary);
            return arr;
        } catch (e) {
            var arr = [];
            for (var i = 0; i < ary.length; i++) {
                arr[i] = ary[i];
            }
            return arr;
        }
    }
    // document.getElementsByClassName兼容性封装
    var getEleByClass =function(strClass, context) {
        if('getElementsByClass' in document){
            return myUtils.toArr(context.getElementsByClassName(strClass));
        }
        context = context || document;
        var nodeList = context.getElementsByTagName('*');
        strClass = strClass.replace(/(^\s+)|(\s+$)/g, '').split(/ +/);
        var result = [];
        for (var i = 0; i < nodeList.length; i++) {
            var temp = nodeList[i];
            var tempClass=temp.className;
            var flag=true;
            for (var j = 0; j < strClass.length; j++) {
                var reg = new RegExp('(^| +)' + strClass[j] + '( +|$)');
                if (!reg.test(tempClass)) {
                    flag=false;
                    break;
                }
            }
            flag?result.push(temp):null;
        }
        return result;
    }
    // 获取元素顶部卷去的最大高度
    var scrollT=function () {
        return document.documentElement.scrollTop||document.body.scrollTop;
    };
    // 获取元素往左卷去的最大值
    var scrollL=function () {
        return document.documentElement.scrollLeft||document.body.scrollLeft;
    }
    // 返回值
    return myUtils = {
        getCss,
        setCss,
        setGroup,
        css,
        toJson,
        toArr,
        execAll,
        children,
        offset,
        getEleByClass,
        scrollT,
        scrollL
    }
})();