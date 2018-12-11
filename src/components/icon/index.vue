<style src="./style.css"></style>
<template src="./template.html"></template>

<script>
    let icons = {}
    export default {
        props: {
            size: {
                type: Number,
                default: 20
            },
            color: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                required: true,
                validator(val) {
                    return val in icons
                }
            },
            flip: {
                type: String,
                validator(val) {
                    return val === 'horizontal' || val === 'vertical'
                }
            }
        },
        computed: {
            icon() {
                return icons[this.name]
            },
            classNames() {
                return {
                    'ui-icon--flipToVertical': this.flip === 'vertical',
                    'ui-icon--flipToHorizontal': this.flip === 'horizontal'
                }
            },
            box: function () {
                return `0 0 ${this.icon.width} ${this.icon.height}`
            }
        },
        add(data) {
            for(let key of Object.keys(data)) {
                icons[key] = data[key]
            }
        },
        remove(key) {
            delete icons[key]
        }
    }
</script>