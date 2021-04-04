<template>
    <div class="circle" :class="[color, {on}, {blink}]"></div>
</template>

<script>
export default {
    name: 'TraficLightItem',
    props: {
        color: {
            validator: function (value) {
                return ['red', 'yellow', 'green'].indexOf(value) !== -1;
            },
            required: true
        },
        on: {
            type: Boolean
        },
        blink: {
            type: Boolean
        }
    }
}
</script>

<style scoped>
.circle {
    margin-bottom: 15px;
    width: 50px;
    height: 50px;
    border: 1px solid #333;
    border-radius: 25px;

    opacity: 0.2;
    border-color: #455A64;

    transition-property: opacity box-shadow border-color;
    transition-duration: .2s;
}

.circle:last-child {
    margin-bottom: 0;
}

.on {
    opacity: 1;
}

.red {
    background-color: red;
}

.red.on {
    box-shadow: 0 0 25px red;
    border-color: red;
}

.yellow {
    background-color: yellow;
}

.yellow.on {
    box-shadow: 0 0 25px yellow;
    border-color: yellow;
}

.green {
    background-color: limegreen;
}

.green.on {
    box-shadow: 0 0 25px limegreen;
    border-color: limegreen;
}

@keyframes blink {
  from {opacity: 1.0;}
  to {opacity: 0.5;}
}

.blink {
	animation-name: blink;
	animation-duration: 0.5s;
	animation-iteration-count:infinite;
	animation-timing-function:ease-in-out;
	animation-direction: alternate;
}
</style>