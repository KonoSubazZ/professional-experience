<template>
    <div class="container" ref="container">
        <div class="draggable-icon" :style="{ left: iconX + 'px', top: iconY + 'px' }" @touchstart="startDrag"
            @touchmove="drag" @touchend="stopDrag" draggable>
            <!-- 这里放你的图标 -->
            <img src="../../assets/modal.png" alt="" class=" pictures" @click="Setting()" />
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            isDragging: false,
            iconX: 0,
            iconY: 2000,
            mouseX: 0,
            mouseY: 0,
            containerRect: null,
            iconWidth: 110
        };
    },
    mounted() {
        if (localStorage.getItem("iconX")){
            this.iconX=localStorage.getItem("iconX")
        }
        if(localStorage.getItem("iconY")){
            this.iconY=localStorage.getItem("iconY")
        }
    },
    methods: {
        Setting() {
            this.$parent.Setting();
        },
        startDrag(event) {
            this.isDragging = true;
            this.mouseX = event.touches[0].clientX;
            this.mouseY = event.touches[0].clientY;

            this.containerRect = this.$el.parentElement.getBoundingClientRect();
            // this.containerRect = window.innerWidth
            document.addEventListener("touchmove", this.drag);
            document.addEventListener("touchup", this.stopDrag);
        },
        drag(event) {
            // console.log(this.isDragging,'this.isDragging');
            console.log(event.touches[0])
            if (this.isDragging) {
                const deltaX = event.touches[0].clientX - this.mouseX;
                const deltaY = event.touches[0].clientY - this.mouseY;
                this.iconX += deltaX;
                this.iconY += deltaY;
                localStorage.setItem("iconY", this.iconY)
                this.mouseX = event.touches[0].clientX;
                this.mouseY = event.touches[0].clientY;
            }
        },
        stopDrag() {
            this.isDragging = false;
            // 吸附到最近的左边或右边边缘
            if (this.iconX < this.containerRect.width / 2 - this.iconWidth / 2) {
                this.iconX = 0;
            } else {
                this.iconX = this.containerRect.width - this.iconWidth;
            }
            localStorage.setItem("iconX", this.iconX)
            localStorage.setItem("iconY", this.iconY)
            document.addEventListener("touchmove", this.drag);
            document.addEventListener("touchup", this.stopDrag);
        }
    }
};
</script>
  
<style scoped>
.draggable-icon {
    position: absolute;
    cursor: grab;
}


.pictures {
    display: inline-block;
    width: 3vh;
    height: 3vh;
    z-index: 100;
}

.container {
    position: relative;
    padding: 0;
    margin: 0;
    z-index: 30;
}
</style>
  