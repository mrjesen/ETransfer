<template>
    <div>
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
                <span class="text-700 inline-block font-medium border-1 surface-border p-3  border-round" style="word-break: break-word; max-width: 80%;">
                    <pre class="m-0">{{ msg.data.message }}</pre>
                </span>
                <p class="text-700  text-sm mt-1">{{ formatTime(msg.time) }} <i
                    class="pi pi-check ml-2 text-green-400"></i></p>
            </div>
        </div>
        <div v-else>
            <div class="grid grid-nogutter mb-4">
                <div class="col mt-1 text-right">
                    <div
                        class="inline-block text-left font-medium border-1 surface-border bg-primary-100 text-primary-900 p-3  border-round"
                        style="word-break: break-word; max-width: 80%;">
                        <pre class="m-0">{{ msg.data.message }}</pre>
                    </div>
                    <p class="text-700 text-sm mt-1">{{ formatTime(msg.time) }} <i
                        class="pi pi-check ml-2 text-green-400"></i></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "MessageText",
    data() {
        return {};
    },
    props: {
        msg: Object
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
    }
}
</script>

<style scoped>

</style>
