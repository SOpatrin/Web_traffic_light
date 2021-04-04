<template>
    <div class="margin-items card glass">
        <div class="traffic-light-container card glass">
            <div class="body">
                <TrafficLightItem color="red" :on="color === 'red'" :blink="color === 'red' && timer < timerLowerBound" />
                <TrafficLightItem color="yellow" :on="color === 'yellow'" :blink="color === 'yellow' && timer < timerLowerBound" />
                <TrafficLightItem color="green" :on="color === 'green'" :blink="color === 'green' && timer < timerLowerBound" />
            </div>
            <h1 class="timer" :class="{pulse: timer < timerLowerBound}">{{ timer.toFixed(2) }}</h1>
        </div>
        <form action="" class="controls-container card glass">
            <fieldset>
                <div class="row">
                    <label class="input-label">
                        Red duration
                        <input type="range" name="red-time" v-model.number="colorTimes.red" min="1" max="30" />
                    </label>
                    <output>{{ colorTimes.red + 's' }}</output>
                </div>
                <div class="row">
                    <label class="input-label">
                        Yellow duration
                        <input type="range" name="yellow-time" v-model.number="colorTimes.yellow" min="1" max="30" />
                    </label>
                    <output>{{ colorTimes.yellow + 's' }}</output>
                </div>
                <div class="row">
                    <label class="input-label">
                        Green duration
                        <input type="range" name="green-time" v-model.number="colorTimes.green" min="1" max="30" />
                    </label>
                    <output>{{ colorTimes.green + 's' }}</output>
                </div>
                <div class="row">
                    <label class="input-label">
                        Countdown start
                        <input type="range" name="timer-lower-bound" v-model.number="timerLowerBound" min="0" max="30" />
                    </label>
                    <output>{{ timerLowerBound + 's' }}</output>
                </div>
                <div class="row">
                    <label class="input-label">
                        Tick rate
                        <input type="range" name="tick-rate" v-model.number="tickRate" min="1" max="60" />
                    </label>
                    <output>{{ tickRate + 'hz' }}</output>
                </div>
            </fieldset>
        </form>
    </div>
</template>

<script>
import TrafficLightItem from './TrafficLightItem.vue';

export default {
    name: 'TrafficLightBody',
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
            lastUpdated: performance.now(),
            tickRate: 10,
            colorEnum,
            colorTimes
        }
    },
    components: { 
        TrafficLightItem 
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

        // Add wathcers on nested object props
        Object.keys(this.colorTimes).forEach((key) => {
            this.$watch('colorTimes.' + key, function() {
                if (key === this.color) {
                    this.timer = this.colorTimes[this.color];
                }
            });
        })
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
        },
        tickRate: {
            immediate: true,
            handler: function() {
                // Set timer interval
                clearInterval(this.timerInterval);
                this.timerInterval = setInterval(this.changeTimer, 1000 / this.tickRate);
            }
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
        },
        // Change timer value according current time
        changeTimer: function() {
            this.timer -= (performance.now() - this.lastUpdated) / 1000;
            this.lastUpdated = performance.now();
        }
    },
    beforeDestroy: function() {
        // Clear timer interval
        clearInterval(this.timerInterval);
    }
}
</script>

<style scoped>
.glass {
    background: white;
    background: linear-gradient(to top left, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.5));
    border-radius: 20px;
    box-shadow: 2px 2px rgba(255, 255, 255, 0.5);
}

.card {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px;
}

.margin-items > * {
    margin: 20px;
}

.traffic-light-container, .controls-container {
    width: 200px;
}

.body {
    margin: auto;
    width: 50px;
    background-color: #333;
    padding: 25px;
    border-radius: 20px;
    border: 2px solid #222;
    box-shadow: 5px 5px #222;
}

.timer {
    width: 70%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0;
    font-size: 3rem;
    text-align: center;
}

form fieldset {
    border: none;
    margin: 0;
    padding: 0;
    width: 100%;
}

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.input-label {
    display: flex;
    flex-direction: column;
    margin-right: 20px;
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