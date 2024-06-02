<template>
    <div >
        <div v-if="msg.from==='other'" class="grid grid-nogutter mb-4">
            <div class="mr-3 mt-1">
                <div class="p-avatar p-component p-avatar-circle p-avatar-lg shadow-3">
                    <svg height="24" viewBox="0 0 19 19" fill="#f00"
                         xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="paint0_linear_7_2" x1="4.02237" y1="9.46943e-08"
                                            x2="8.24281" y2="16.4905"
                                            gradientUnits="userSpaceOnUse">
                                <stop stop-color="var(--primary-500)" offset="0"></stop>
                                <stop offset="1" stop-color="var(--primary-700)"></stop>
                            </linearGradient>
                        </defs>
                        <g fill="url(#paint0_linear_7_2)">
                            <text x="0" y="16" font-weight="bold" font-size="18">E</text>
                            <text x="9" y="16" font-weight="bold" font-size="18">T</text>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="col mt-1">

                <div
                    class="cursor-pointer  text-blue-500 text-700 inline-block font-medium border-1 surface-border p-3  border-round"
                    style="word-break: break-word; max-width: 80%;">
                    <div class="inline-block mr-3">
                        <span class="mb-2 inline-block cursor-pointer "  @click="downloadFile(msg.data.file)">{{msg.data.file.name}}</span>
                        <p v-if="msg.data.file.size===msg.data.file.totalSize" class="m-0 text-500 text-sm font-normal flex justify-content-between">
                            {{getSize(msg.data.file.totalSize)}}
                        </p>
                        <p v-else class="m-0 text-500 text-sm font-normal">{{(msg.data.file.size/msg.data.file.totalSize*100).toFixed(0)}}%</p>
                    </div>
                </div>


                <p class="text-700  text-sm mt-1">{{ formatTime(msg.time) }}
                    <i class="pi pi-check ml-2 text-green-400"></i>
                </p>
            </div>
        </div>
        <div v-else>
            <div class="mb-4">
                <div class="mt-1 text-right">
                    <div
                        class=" text-blue-500 inline-block text-left  bg-primary-100 p-3 font-medium border-round"
                        style="word-break: break-word; max-width: 80%;">
                        <div class="inline-block mr-3">
                            <span class="mb-2 inline-block cursor-pointer " @click="downloadFile(msg.data.file)">{{msg.data.file.name}}</span>
                            <p v-if="msg.data.file.size===msg.data.file.totalSize" class="m-0 text-500 text-sm font-normal">
                                {{getSize(msg.data.file.totalSize)}}
                            </p>
                            <p v-else class="m-0 text-500 text-sm font-normal">{{(msg.data.file.size/msg.data.file.totalSize*100).toFixed(0)}}%</p>
                        </div>
                    </div>
                    <p class="text-700 text-sm mt-1">{{ formatTime(msg.time) }}
                        <i  class="pi pi-check ml-2 text-green-400"></i>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MessageFile",
    data() {
        return {
        };
    },
    components:{
    },
    props:{
        msg:Object
    },
    created() {
    },
    methods: {
        formatTime(date = 0, fmt = 'hh:mm:ss') {

            date = new Date(+date)
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            let o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            };
            for (let k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    let str = o[k] + '';
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
                }
            }
            return fmt;
        },
        downloadFile(file){
            let blob = new Blob(file.data);
            // 获取heads中的filename文件名
            let downloadElement = document.createElement("a");
            // 创建下载的链接
            downloadElement.href = window.URL.createObjectURL(blob);
            // 下载后文件名
            downloadElement.download = file.name;
            document.body.appendChild(downloadElement);
            // 点击下载
            downloadElement.click();         // 下载完成移除元素
            document.body.removeChild(downloadElement);
            // 释放掉blob对象
        },
        //计算文件大小
        getSize(value){
            if(null==value||value==''){
                return "0 B";
            }
            let unitArr = ["B","KB","MB","GB","TB","PB","EB","ZB","YB"];
            let index=0, srcsize = parseFloat(value);
            index=Math.floor(Math.log(srcsize)/Math.log(1024));
            let size =srcsize/Math.pow(1024,index);
            //  保留的小数位数
            size=parseFloat(size.toFixed(1));
            return size+" "+unitArr[index];
        },
    }
}
</script>

<style scoped>

</style>
