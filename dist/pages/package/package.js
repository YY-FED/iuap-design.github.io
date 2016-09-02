window.onload = function() {

    /**
     * 选中元素,执行ajax
     */
    var cs = {
        init: function(){

            this.selAll();
            this.charSend();
        },

        Dom: {
            downBottom: document.getElementById('button'),
            downTop: document.getElementById('buttonTop'),
            blockWrap: document.querySelectorAll('#tab-panel-2 .color-whole-div'),
        },


        /**
         * 定制 - 选中元素
         */
        selAll: function() {
            var contWrap = this.Dom.blockWrap;
            var selFun = function(ele, index, ary) {
                var selWrap = ele.querySelectorAll('.tree-parent')[0];
                var subCheckbox = ele.querySelectorAll('li.u-checkbox'); 
                selWrap.addEventListener('click', function() {
                    var isCheck = u.hasClass(this,"is-checked");

                    if(isCheck) {
                        subCheckbox.forEach(function(subele){
                            u.addClass(subele,'is-checked');
                        })
                    } else {
                        subCheckbox.forEach(function(subele){
                            u.removeClass(subele,'is-checked');
                        })
                    }

                })
            };
            contWrap.forEach(selFun);
        },

        /**
         * 数据整理
         */
        charFun: function(event) {
            var dataJson = {};
            var checkedUnit = document.querySelectorAll('#tab-panel-2 .coreModel li.is-checked');
            var checkedData = function(checkele) {
                // data-catlog对应不同类别组件，如polyfill,css组件
                var checkClass = checkele.getAttribute('data-catlog');
                if(!dataJson[checkClass]){
                    dataJson[checkClass] = [];
                }
                // 添加选中的组件进入相应类别
                var checkFile = checkele.getAttribute('data-file');
                dataJson[checkClass].push(checkFile);
            };
            checkedUnit.forEach(checkedData);

            $.ajax({
                type: 'post',
                dataType: 'text',
                data: dataJson,
                url: '/package',
                success: function (patch) {
                    location.href = patch;
                },
                error: function (patch) {
                    console.error(patch);
                }
            });

            event.stopPropagation();

        },
        /**
         * 提交事件
         */
        charSend: function() {
            var self = this;
            var downAry = [];
            downAry.push(this.Dom.downBottom);
            downAry.push(this.Dom.downTop);
            var submitEvent = function(ele){
                ele.addEventListener('click',self.charFun);
            };
            downAry.forEach(submitEvent);
        }

        
    };
    cs.init();

}