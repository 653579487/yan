/**
 * �ƳصĿ�� ������ͬ������ͬ��
 * Created by Administrator on 2017/1/1 0001.
 * ������ͨ�ÿ��
 */
var $$ =function (){};
/*����ģ��*/
$$.prototype = {
    extend:function(tar,source){
           for(var i in source){
               tar[i] = source[i];
           }
        return tar;
    }
};
/*ʵ����*/
var $$ = new $$();
/*����ģ��*/
$$.extend($$,{
    //ȥ����߿ո�
    ltrim:function(str){
        return str.replace(/(^\s*)/g,'');
    },
    //ȥ���ұ߿ո�
    rtrim:function(str){
        return str.replace(/(\s*$)/g,'');
    },
    //ȥ���ո�
    trim:function(str){
        return str.replace(/(^\s*)|(\s*$)/g, '');
    },
    /*�Լ���װ��Ajax*/
    myAjax: function (URL, fn) {
        var xhr = createXHR();	//������һ�������������IE6���ݡ�
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    fn(xhr.responseText);
                } else {
                    alert("����ģ�");
                }
            }
        };
        xhr.open("get", URL, true);
        xhr.send();

        //�հ���ʽ����Ϊ�������ֻ������ajax���������Է�������
        function createXHR() {
            //�����������ڡ�JavaScript�߼�������� ��3�桷��21��
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != "undefined") {
                if (typeof arguments.callee.activeXString != "string") {
                    var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                            "MSXML2.XMLHttp"
                        ],
                        i, len;

                    for (i = 0, len = versions.length; i < len; i++) {
                        try {
                            new ActiveXObject(versions[i]);
                            arguments.callee.activeXString = versions[i];
                            break;
                        } catch (ex) {
                            //skip
                        }
                    }
                }

                return new ActiveXObject(arguments.callee.activeXString);
            } else {
                throw new Error("No XHR object available.");
            }
        }
    },
    /*formatString ������*/
    formateString : function (str, data){
        /* * ��һ��������������ʽ���ڶ�����������������
         * �������ĵ�һ��������ƥ����ַ������ڶ��������������е�ֵ*/
        return str.replace(/@\((\w+)\)/g, function(match, key){
            return typeof data[key] === "undefined" ? '' : data[key]});
        /* function Login(){
         var user={name:'�Ƴ�'}
         var span = document.getElementById("span");
         span.innerHTML = formateString("��ӭ@(name)�����ٶ�����",user)
         };
         */
    }
});
//ѡ��ģ��
$$.extend($$,{
    //��ȡID
    $id:function (str){
        return document.getElementById(str)
    },
    //��ȡtag
    $tag:function(context,tag){
        if(typeof context == 'string'){
            context = $$.$id(context);
        }
        if(context){
            return context.getElementsByTagName(tag);
        }else{
            return document.getElementsByTagName(tag);
        }
    },
    //classѡ����
    $class:function(className,context){
        var i=0,len,dom=[],arr=[];
        //������ݹ��������ַ��� ����ת����Ԫ�ض���
        if($$.isString(context)){
            context = document.getElementById(context);
        }else{
            context = document;
        }
//        �������getElementsByClassName
        if(context.getElementsByClassName){
            return context.getElementsByClassName(className);
        }else{
            //����������֧��
            dom = context.getElementsByTagName('*');

            for(i;len=dom.length,i<len;i++)
            {
                if(dom[i].className)
                {
                    arr.push(dom[i]);
                }
            }
        }
        return arr;
    },
    //����ѡ����
    $group:function(content) {
        var result=[],doms=[];
        var arr = $$.trim(content).split(',');
        //alert(arr.length);
        for(var i=0,len=arr.length;i<len;i++) {
            var item = $$.trim(arr[i])
            var first= item.charAt(0)
            var index = item.indexOf(first)
            if(first === '.') {
                doms=$$.$class(item.slice(index+1))
                //ÿ��ѭ����doms������reult��
                //result.push(doms);//������Դ
                //����1��� ��װ�ظ��Ĵ���ɺ���
                pushArray(doms,result)
            }else if(first ==='#'){
                doms=[$$.$id(item.slice(index+1))]//���壺֮ǰ���Ƕ����doms�����飬����$id��ȡ�Ĳ������飬���ǵ���Ԫ��
                //��װ�ظ��Ĵ���ɺ���
                pushArray(doms,result)
            }else{
                doms = $$.$tag(item)
                pushArray(doms,result)
            }
        }
        return result;
        //��װ�ظ��Ĵ���
        function pushArray(doms,result){
            for(var j= 0, domlen = doms.length; j < domlen; j++){
                result.push(doms[j])
            }
        }
    },
    //���ѡ����
    $cengci:function (select){
        //�������Ʒ��� -- Ѱ�һ��Ƶ�
        var sel = $$.trim(select).split(' ');
        var result=[];
        var context=[];
        for(var i = 0, len = sel.length; i < len; i++){
            result=[];
            var item = $$.trim(sel[i]);
            var first = sel[i].charAt(0);
            var index = item.indexOf(first);
            if(first ==='#'){
                //�����#���ҵ���Ԫ�أ�
                pushArray([$$.$id(item.slice(index + 1))]);
                context = result;
            }else if(first ==='.'){
                //�����.
                //�����.
                //�ҵ�context�����е�classΪ��s-1����Ԫ�� --context�Ǹ�����
                if(context.length){
                    for(var j = 0, contextLen = context.length; j < contextLen; j++){
                        pushArray($$.$class(item.slice(index + 1), context[j]));
                    }
                }else{
                    pushArray($$.$class(item.slice(index + 1)));
                }
                context = result;
            }else{
                //����Ǳ�ǩ
                //�������ף��ҵ������е�Ԫ��==���׶�����context��
                if(context.length){
                    for(var j = 0, contextLen = context.length; j < contextLen; j++){
                        pushArray($$.$tag(item, context[j]));
                    }
                }else{
                    pushArray($$.$tag(item));
                }
                context = result;
            }
        }
        return context;
        //��װ�ظ��Ĵ���
        function pushArray(doms){
            for(var j= 0, domlen = doms.length; j < domlen; j++){
                result.push(doms[j])
            }
        }
    },
    //����+���
    $select:function(str) {
        var result = [];
        var item = $$.trim(str).split(',');
        for(var i = 0, glen = item.length; i < glen; i++){
            var select = $$.trim(item[i]);
            var context = [];
            context = $$.$cengci(select);
            pushArray(context);

        };
        return result;

        //��װ�ظ��Ĵ���
        function pushArray(doms){
            for(var j= 0, domlen = doms.length; j < domlen; j++){
                result.push(doms[j])
            }
        }
    },
    //html5ʵ�ֵ�ѡ����
    $all:function(selector,context){
        context = context || document;
        return  context.querySelectorAll(selector);
    },
});
/*�ж�����ģ��*/
$$.extend($$,{
    //�������ͼ��
    isNumber:function (val){
        return typeof val === 'number' && isFinite(val)
    },
    isBoolean:function (val) {
        return typeof val ==="boolean";
    },
    isString:function (val) {
        return typeof val === "string";
    },
    isUndefined:function (val) {
        return typeof val === "undefined";
    },
    isObj:function (str){
        if(str === null || typeof str === 'undefined'){
            return false;
        }
        return typeof str === 'object';
    },
    isNull:function (val){
        return  val === null;
    },
    isArray:function (arr) {
        if(arr === null || typeof arr === 'undefined'){
            return false;
        }
        return arr.constructor === Array;
    },
});
/*CSS ģ��*/
$$.extend($$,{
    //��ʽ
    css:function(context, key, value){
        var dom = $$.isString(context)?$$.$all(context) : context;
        //���������
        if(dom.length){
            //�ȹǼܹǼ� -- ����ǻ�ȡģʽ -- ���������ģʽ
            //���value��Ϊ�գ����ʾ����
            if(value){
                for(var i = dom.length - 1; i >= 0; i--){
                    setStyle(dom[i],key, value);
                }
                //            ���valueΪ�գ����ʾ��ȡ
            }else{
                return getStyle(dom[0]);
            }
            //�����������
        }else{
            if(value){
                setStyle(dom,key, value);
            }else{
                return getStyle(dom);
            }
        }
        function getStyle(dom){
            if(dom.currentStyle){
                return dom.currentStyle[key];
            }else{
                return getComputedStyle(dom,null)[key];
            }
        }
        function setStyle(dom,key,value){
            dom.style[key] = value;
        }
    },
    //��ʾ
    show:function (content){
        var doms =  $$.$all(content)
        for(var i= 0,len=doms.length;i<len;i++){
            $$.css(doms[i], 'display', 'block');
        }
    },
    //���غ���ʾԪ��
    hide:function (content){
        var doms =  $$.$all(content)
        for(var i= 0,len=doms.length;i<len;i++){
            $$.css(doms[i], 'display', 'none');
        }
    },
    //Ԫ�ظ߶ȿ�ȸ���
    //���㷽ʽ��clientHeight clientWidth innerWidth innerHeight
    //Ԫ�ص�ʵ�ʸ߶�+border��Ҳ������������
    Width:function (id){
        return $$.$id(id).clientWidth
    },
    Height:function (id){
        return $$.$id(id).clientHeight
    },

    //Ԫ�صĹ����߶ȺͿ��
    //��Ԫ�س��ֹ�����ʱ������ĸ߶������֣���������ĸ߶� ʵ�ʸ߶ȣ����Ӹ߶�+���ɼ��ĸ߶ȣ�
    //���㷽ʽ scrollwidth
    scrollWidth:function (id){
        return $$.$id(id).scrollWidth
    },
    scrollHeight:function (id){
        return $$.$id(id).scrollHeight
    },


    //Ԫ�ع�����ʱ�� ������ֹ����� ��������Ͻǵ�ƫ����
    //���㷽ʽ scrollTop scrollLeft
    scrollTop:function (id){
        return $$.$id(id).scrollTop
    },
    scrollLeft:function (id){
        return $$.$id(id).scrollLeft
    },

    //��ȡ��Ļ�ĸ߶ȺͿ��
    screenHeight:function (){
        return  window.screen.height
    },
    screenWidth:function (){
        return  window.screen.width
    },


    //�ĵ��ӿڵĸ߶ȺͿ��
    wWidth:function (){
        return document.documentElement.clientWidth
    },
    wHeight:function (){
        return document.documentElement.clientHeight
    },

    //�ĵ��������������ĸߺͿ�
    wScrollHeight:function () {
        return document.body.scrollHeight
    },
    wScrollWidth:function () {
        return document.body.scrollWidth
    },

    //��ȡ������������䶥����ƫ��
    wScrollTop:function () {
        var scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
        return scrollTop
    },
    //��ȡ���������������ߵ�ƫ��
    wScrollLeft:function () {
        var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
        return scrollLeft
    }
});
/*���� ģ��*/
$$.extend($$,{
    //���Բ�������ȡ���Ե�ֵ���������Ե�ֵ at tr��'test','target','_blank'��
    attr:function(content, key, value){
        var dom =  $$.$all(content);
//        ���������  ����tag
        if(dom.length){
            if(value){
                for(var i= 0, len=dom.length; i <len; i++){
                    dom[i].setAttribute(key, value);
                }
            }else{
                return dom[0].getAttribute(key);
            }
//            ����ǵ���Ԫ��  ����id
        }else{
            if(value){
                dom.setAttribute(key, value);
            }else{
                return dom.getAttribute(key);
            }
        }
    },
    //��̬��Ӻ��Ƴ�class
    addClass:function (context, name){
        var doms = $$.$all(context);
        //�����ȡ���Ǽ���
        if(doms.length){
            for(var i= 0,len=doms.length;i<len;i++){
                addName(doms[i]);
            }
            //�����ȡ�Ĳ��Ǽ���
        }else{
            addName(doms);
        }
        function addName(dom){
            dom.className = dom.className + ' ' + name;
        }
    },
    removeClass:function (context, name){
        var doms = $$.$all(context);
        if(doms.length){
            for(var i= 0,len=doms.length;i<len;i++){
                removeName(doms[i]);
            }
        }else{
            removeName(doms);
        }
        function removeName(dom){
            dom.className = dom.className.replace(name, '');
        }
    },
    //�ж��Ƿ���
    hasClass:function(context,name){
        var doms = $$.$all(context)
        var flag = true;
        for(var i= 0,len=doms.length;i<len;i++){
            flag = flag && check(doms[i],name)
        }

        return flag;
        //�ж�����Ԫ��
        function check(element,name){
            return -1<(" "+element.className+" ").indexOf(" "+name+" ")
        }
    },
    //��ȡ
    getClass:function (id){
        var doms = $$.$all(id)
        return $$.trim(doms[0].className).split(" ")
    }
});
//����ģ��
$$.extend($$, {
    //innerHTML�ĺ����汾
    html: function (context, value) {
        var doms = $$.$all(context);
        //����
        if (value) {
            for (var i = 0, len = doms.length; i < len; i++) {
                doms[i].innerHTML = value;
            }
        } else {
            return doms[0].innerHTML
        }
    }
});
/*�����й�ģ��*/
$$.extend($$,{});
/*�����й�ģ��*/
$$.extend($$,{});
/*�¼�ģ��*/
$$.extend($$,{
    //���¼�
    on: function (id, type, fn){
        var dom = $$.isString(id)?document.getElementById(id):id;
        //���֧��
        //W3C�汾 --��� �ȸ� �ȴ���������
        //�������������Ƿ�֧��ĳ�����ԣ�����������ͨ�����ַ�ʽ
        if(dom.addEventListener ){
            dom.addEventListener(type, fn, false);
        }else if(dom.attachEvent){
            //���֧�� --IE
            //
            dom.attachEvent('on' + type, fn);
        }
    },
    //����¼�
    un: function (id, type, fn) {
        //var dom = document.getElementById(id);
        var dom = $$.isString(id) ? document.getElementById(id) : id;
        if (dom.removeEventListener) {
            dom.removeEventListener(type, fn);
        } else if (dom.detachEvent) {
            dom.detachEvent(type, fn);
        }
    },
    /*���*/
    click : function(id,fn){
        this.on(id,'click',fn);
    },
    /*�������*/
    mouseover:function(id,fn){
        this.on(id,'mouseover',fn);
    },
    /*����뿪*/
    mouseout:function(id,fn){
        this.on(id,'mouseout',fn);
    },
    /*����*/
    hover : function(id,fnOver,fnOut){
        if(fnOver){
            this.on(id,"mouseover",fnOver);
        }
        if(fnOut){
            this.on(id,"mouseout",fnOut);
        }
    },
    //�¼�ί��
    delegate:function (pid, eventType, selector, fn) {
        //��������
        var parent = $$.$id(pid);
        function handle(e){
            var target = $$.GetTarget(e);
            if(target.nodeName.toLowerCase()=== selector || target.id === selector || target.className.indexOf(selector) != -1){
                // ���¼�ð�ݵ�ʱ�򣬻��Դ˱���ÿ��������������ҵ���Ӧ��Ԫ�أ���ִ�����º���
                // Ϊʲôʹ��call����Ϊcall���Ըı�thisָ��
                // ��һ��ǵã������е�thisĬ��ָ��window��������ϣ��ָ��ǰdomԪ�ر���
                fn.call(target);
            }
        }
        //�����Ǹ�����Ԫ�ذ�һ���¼�������ִ��˳���Ȳ���Ŀ��Ԫ�أ�Ȼ���¼���ð��
        //�������Ǹ�Ԫ�ض����һ���¼�
        parent[eventType]=handle;
    },
    //�¼�����
    getEvent:function(event){
        return event?event:window.event;
    },
    //��ȡĿ��
    GetTarget :function(event){
        var e = $$.getEvent(event);
        return e.target|| e.srcElement;
    },
    //��֯Ĭ����Ϊ
    preventDefault:function(event){
        var event = $$.getEvent(event);
        if(event.preventDefault){
            event.preventDefault();
        }else{
            event.returnValue = false;
        }
    },
    //��ֹð��
    stopPropagation:function(event){
        var event = $$.getEvent(event);
        if(event.stopPropagation){
            event.stopPropagation();
        }else{
            event.cancelBubble = true;
        }
    }
});
/*����ģ��*/
$$.extend($$,{});
