<template>
    <div>
        <div class="body">
            <TraficLightItem color="red" :on="color === 'red'" :blink="color === 'red' && timer < timerLowerBound" />
            <TraficLightItem color="yellow" :on="color === 'yellow'" :blink="color === 'yellow' && timer < timerLowerBound" />
            <TraficLightItem color="green" :on="color === 'green'" :blink="color === 'green' && timer < timerLowerBound" />
        </div>
        <h1 class="timer" :class="{pulse: timer < timerLowerBound}">{{ timer.toFixed(1) }}</h1>
    </div>
</template>

<script>
import TraficLightItem from './TraficLightItem.vue';

const colorMap = {
    red: 0,
    yellow: 1,
    green: 2
}
const colorTimes = {
    red: 10,
    yellow: 3,
    green: 15
}

export default {
    name: 'TraficLightBody',
    props: {
        color: {
            validator: function (value) {
                return ['red', 'yellow', 'green'].indexOf(value) !== -1;
            },
            required: true
        }
    },
    data: function() {
        return {
            direction: 1,
            timer: 0,
            timerLowerBound: 3
        }
    },
    components: { 
        TraficLightItem 
    },
    mounted: function() {
        if (localStorage.timer && (localStorage.color == this.color)) {
            this.timer = Number(localStorage.timer);
        } else {
            this.timer = colorTimes[this.color];
        }

        if (localStorage.direction) {
            this.direction = Number(localStorage.direction);
        }
    },
    watch: {
        color: function() {
            this.timer = colorTimes[this.color];
        },
        timer: function() {
            clearTimeout(this.timeout);
            if (this.timer > 0) {
                this.timeout = setTimeout(() => {
                    this.timer -= .100;
                }, 100)
            } else {
                this.changeLight();
            }
            
            localStorage.color = this.color;
            localStorage.timer = this.timer;
        }
    },
    methods: {
        changeLight: function() {
            let currentLight = colorMap[this.color];

            if (currentLight === 2) {
                this.direction = -1;
            }
            if (currentLight === 0) {
                this.direction = 1;
            }

            currentLight += this.direction;
            this.$router.push('/' + Object.keys(colorMap)[currentLight]);

            localStorage.direction = this.direction;
        }
    },
    beforeDestroy: function() {
        clearTimeout(this.timeout);
    }
}
</script>

<style scoped>
.body {
    margin: auto;
    width: 50px;
    background-color: #333;
    padding: 25px;
    border-radius: 7px;
    border: 2px solid #222;
}

.timer {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    font-size: 3rem;
    text-align: center;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  to {
    transform: scale(1);
  }
}

.pulse {
	animation-name: pulse;
	animation-duration: 1s;
	animation-iteration-count:infinite;
	animation-timing-function:ease-in-out;
	animation-direction: alternate;
}
</style>