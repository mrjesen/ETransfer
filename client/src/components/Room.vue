<template>
    <div class="layout-content-wrapper" @dragover.prevent="handleDragOver"
         @dragleave="handleDragLeave"
         @drop.prevent="handleDrop"
         @paste="handlePaste"
    >
        <div class="layout-content">
            <div class="p-card p-component p-0 flex">
                <div class="flex flex-column relative" style="height: calc(100vh - 62px - 4em);">

                    <div class="flex border-bottom-1 surface-border p-3 align-items-center">
                        <div class="mr-3">
                            <div class="p-avatar p-component p-avatar-circle p-avatar-xl">
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
                        <div class="overflow-hidden ellipsis">
                            <span v-if="isConnected" class="text-green-500 block text-lg mb-2">已连接</span>
                            <span v-else class="text-orange-500 block text-lg mb-2">等待对方连接..</span>
                            <span  class="text-blue-500 text-sm cursor-pointer" @click="copyText($event,roomUrl)">
                                <i class="pi pi-copy "></i>
                                {{ roomUrl }}
                            </span>

                        </div>

                    </div>
                    <div class="user-message-container p-3 md:px-4 lg:px-6 lg:py-4 mt-2 overflow-y-auto flex-1"
                         style="height: auto">
                        <div v-for="(msg,index) in messages" :key="index">
                            <MessageText v-if="msg.data.type==='message'" :msg="msg"></MessageText>
                            <MessageFile v-else-if="msg.data?.type==='file'" :msg="msg"></MessageFile>
                            <MessageImg v-else-if="msg.data?.type==='img'" :msg="msg"></MessageImg>
                        </div>
                    </div>
                    <div class="pt-2 pl-3 pr-3 pb-3 md:pl-4 md:pr-4  md:pb-4 flex flex-column mt-auto border-top-1 surface-border gap-3" >
                        <div v-if="canSend" class="flex align-items-center tools">
                            <span  class="pi pi-file text-400 hover:text-primary-300 cursor-pointer text-xl" v-tooltip="'发送文件'"  @click="chooseFile" />
                            <input type="file" ref="file" @change="sendFile" class="aman-file">
                            <span class="ml-4 pi pi-desktop text-400 hover:text-primary-300 cursor-pointer text-xl"  v-tooltip="'分享屏幕'"  @click="shareScreen" aria-disabled="true"></span>
                        </div>
                        <div v-else class="flex align-items-center tools">
                            <span  class="pi pi-file text-300  text-xl"  />
                            <input type="file" ref="file" @change="sendFile" class="aman-file">
                            <span class="ml-4 pi pi-desktop text-300 text-xl"></span>
                        </div>
                        <div class="flex align-items-center w-full">
                            <Textarea class="w-full flex-1 " v-model="message" :placeholder="canSend ? '' : '等待对方连接或者建立链接失败..'"  :disabled="!canSend" autofocus @keydown.enter.prevent="sendMsg" @keydown.enter.ctrl.exact.prevent="ctrlEnter"/>
                            <div class="w-full block w-auto ml-2">
                                <Button  icon="pi pi-send" iconPos="left" :disabled="!canSend" @click="sendMsg"/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <Toast position="top-center"/>
</template>

<script>
import Clipboard from 'clipboard';
import Toast from 'primevue/toast'
import {useToast} from "primevue/usetoast";
import Textarea from "primevue/textarea";
import MessageText from "@/components/MessageText.vue";
import MessageFile from "@/components/MessageFile.vue";
import MessageImg from "@/components/MessageImg.vue";
let toast;
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Room",
    components: {
        MessageFile,
        MessageText,
        MessageImg,
        Toast,
        Textarea,
    },
    props: {
        roomId: String,
        isConnected: Boolean,
        canSend: Boolean,
        messages: Array
    },
    emits: ["sendMsg",'chooseFile','shareScreen'],
    data() {
        return {
            roomUrl: '',
            message: ""
        };
    },
    setup() {
        toast = useToast();
    },
    created() {
        this.roomUrl = window.location.origin + '/#/' + this.roomId
        this.$nextTick(()=>{

        })
    },
    methods: {
        handleDragOver(event) {
            event.preventDefault();
        },
        handleDragLeave() {
        },
        handleDrop(event) {
            event.preventDefault();
            console.log(event)
            for (let index in event.dataTransfer.files) {
                const file=event.dataTransfer.files[index];
                if (file.size >= 0) {
                    this.$emit('chooseFile', file)
                }
            }
        },
        fileToDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        },
        handlePaste(event) {
            // event.preventDefault();
            const items = (event.clipboardData || event.originalEvent.clipboardData)
                .items;
            // let pasteFiles = [];
            for (let index in items) {
                const item = items[index];
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    // 判断file是不是图片
                    if (file.type.startsWith('image/') && file.size >= 0) {
                        let that = this;
                        this.fileToDataURL(file).then(dataUrl => {
                            const data = {
                                message: dataUrl,
                                type: "img",
                            };
                            that.$emit('sendMsg', data);
                        });
                    }
                }
            }
            // this.handleFiles(pasteFiles);
            // console.log(pasteFiles);
        },

        showCall(e) {
            this.$refs.callType.toggle(e)

        },
        chooseFile() {
            this.$refs.file.click()
        },
        sendFile(e) {
            const file = e.target.files[0];
            if (file.size === 0) {
                return
            }
            this.$emit('chooseFile', file)
        },

        sendMsg(e) {
            if (!this.message || e.ctrlKey) {
                return
            }
            const data = {
                message: this.message,
                type: "message",
            };
            this.message = ""
            this.$emit("sendMsg", data)
        },
        ctrlEnter(e) {
            // ctrl+回车换行
            if(!e.ctrlKey) { return }
            const textarea = e.target; //注意此处获取dom
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            const newValue = value.substring(0, start) + "\n" + value.substring(end);
            textarea.value = newValue;
            textarea.selectionStart = textarea.selectionEnd = start + 1;
        },
        copyText(e, text) {

            const clipboard = new Clipboard(e.target, {text: () => text});
            clipboard.on('success', function () {
                toast.add({
                    severity: 'success',
                    summary: '提示',
                    detail: '复制成功！',
                    life: 3000
                })
                clipboard.destroy();
            })
            clipboard.on('error', function () {
                toast.add({
                    severity: 'danger',
                    summary: '提示',
                    detail: '复制失败！',
                    life: 3000
                })
                clipboard.destroy()
            })
            // 解决第一次点击不生效的问题，如果没有，第一次点击会不生效
            clipboard.onClick(e)
        },
        shareScreen(){
            this.$emit('shareScreen')
        },
    }
}
</script>

<style scoped>
.ellipsis {
    white-space: nowrap; /* 防止文本换行 */
    overflow: hidden; /* 隐藏超出容器的部分 */
    text-overflow: ellipsis; /* 显示省略号 */
}


.layout-content-wrapper {
    padding: 2rem;
}

@media screen and (max-width: 991px) {
    .layout-content-wrapper {
        padding: 1rem;
    }
}

.layout-content-wrapper > .layout-content {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
}

.aman-file {
    display: none;
}
</style>
