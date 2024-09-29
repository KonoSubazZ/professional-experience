<template>
    <div class="number-pad">
      <div class="display">{{ displayNumber }}</div>
      <div class="buttons">
        <button v-for="number in numbers" :key="number" @click="handleClick(number)">{{ number }}</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        displayNumber: ''
      }
    },
    methods: {
      handleClick(number) {
        this.displayNumber += number;
      }
    },
    computed: {
      numbers() {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
      }
    }
  }
  </script>
  
  <style scoped>
  .number-pad {
    display: inline-block;
    border: 1px solid #ccc;
    padding: 10px;
  }
  
  .display {
    margin-bottom: 10px;
    padding: 5px;
    border: 1px solid #ccc;
    text-align: center;
  }
  
  .buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 5px;
  }
  
  button {
    padding: 10px;
  }
  </style>
  