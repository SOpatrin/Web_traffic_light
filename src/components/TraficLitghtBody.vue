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
        // Define color enum
        const colorEnum = {
            red: 0,
            yellow: 1,
            green: 2
        }
        Object.freeze(colorEnum);

        // Define time in seconds for each color
        const colorTimes = {
            red: 10,
            yellow: 3,
            green: 15
        }

        return {
            direction: 1,
            timer: 0,
            timerLowerBound: 3,
            timerInterval: null,
            colorEnum,
            colorTimes
        }
    },
    components: { 
        TraficLightItem 
    },
    mounted: function() {
        // Load data from storage
        const storageTimer = sessionStorage.getItem('timer');
        const storageColor = sessionStorage.getItem('color');
        const storageDirection = sessionStorage.getItem('direction');

        if (storageTimer && (storageColor === this.color)) {
            this.timer = Number(storageTimer);
        } else {
            this.timer = this.colorTimes[this.color];
            // Set actual color in storage
            sessionStorage.setItem('color', this.color);
        }

        if (storageDirection) {
            this.direction = Number(storageDirection);
        }

        // Set timer interval
        this.timerInterval = setInterval(() => {
            this.timer -= .100;
        }, 100)
    },
    // Set data in storage
    watch: {
        color: function() {
            this.timer = this.colorTimes[this.color];
            sessionStorage.setItem('color', this.color);
        },
        // And some timer logic
        timer: function() {
            if (this.timer <= 0) {
                this.changeLight();
            }
            
            sessionStorage.setItem('timer', this.timer);
        },
        direction: function() {
            sessionStorage.setItem('direction', this.direction);
        }
    },
    methods: {
        // Change current light and push into url
        changeLight: function() {
            let currentLight = this.colorEnum[this.color];

            if (currentLight === this.colorEnum.green) {
                this.direction = -1;
            }
            if (currentLight === this.colorEnum.red) {
                this.direction = 1;
            }

            currentLight += this.direction;
            this.$router.push('/' + Object.keys(this.colorEnum)[currentLight]);
        }
    },
    beforeDestroy: function() {
        // Clear timer interval
        clearInterval(this.timerInterval);
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