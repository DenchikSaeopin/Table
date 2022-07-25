<template>
    <div class = "container">
      <div class="flex">
        <div class="img-wrapper">
          <img 
            :class = "imgFilters"
            :style = "Sizer"
            v-if="isRebeVisible" 
            src="../assets/rebbi.jpg" >
          <p v-else>Please, standby</p>
        </div>
        <div class="controls">
          <h1>Californian сhutzpah</h1>
          <h2>Фильтры</h2>
          
          <div class="btn-group flex">
            <button 
              :class = "imgFilters.sepia ? 'active' : ''"
              @click = "imgFilters.sepia = !imgFilters.sepia"
              type = "button">
              Сепировать
            </button>

            <button 
              :class = "imgFilters.border ? 'active' : ''"
              @click = "imgFilters.border = !imgFilters.border"
              type = "button">
              Рамка
            </button>

            <button 
              :class = "imgFilters.small ? 'active' : ''"
              @click = "imgFilters.small = !imgFilters.small"
              type = "button">
              Уменьшить
            </button>
            
            <button @click="isRebeVisible = !isRebeVisible">
              {{ isRebeVisible ? "Спрятать" : "Показать" }}
            </button>

          </div>
          <h2>Размер</h2>
          <div class = "btn-group">
            <label>
              Ширина: {{ imgSizes.Width }}
              <input
                @input = "imgSizes.Width = $event.target.value" 
                :value = "imgSizes.Width"
                :max = "imgSizes.maxWidth"
                :min = "imgSizes.minWidth"
                type="range">
            </label>

            <label>
              Высота: {{ imgSizes.Height }}
              <input
                @input = "imgSizes.Height = $event.target.value" 
                :value = "imgSizes.Height"
                :max = "imgSizes.maxHeight"
                :min = "imgSizes.minHeight"
                type="range">
            </label>

          <h2>Поворот</h2>
          <label>
              Поворот на: {{ imgRotate.angle }}
              <input
                @input = "imgRotate.angle = $event.target.value" 
                :value = "imgRotate.angle"
                :max = "imgRotate.maxAngle"
                :min = "imgRotate.minAngle"
                type="range">
            </label>


          </div>
          

        </div>
      </div>           
    </div>
</template>

<script>
export default {
    name: 'Cat',
    data() {
      return {
        isRebeVisible: true,
        imgFilters: {
          sepia: false,
          border: false,
          small: false
        },
        imgSizes: {
          maxWidth: 226,
          maxHeight: 223,
          Width: 226,
          Height: 223,
        },
        imgRotate: {
          maxAngle: 360,
          angle: 0
        }
      }
    },

    computed: {
      Sizer() {
        return {
          width: `${this.imgSizes.Width}px`,
          height: `${this.imgSizes.Height}px`,
          transform: `rotate(${this.imgRotate.angle}deg)`
        }
      },

    }
}
</script>

<style lang="scss" scoped>
    .container {
    margin-top: 40px;
  }
  .controls {
    margin-left: 20px;
  }
  .img-wrapper {
    width: 226px;
    height: 223px;
    background-color: #cecece;
  }
  img {
    transition: 0.2s ease;
    &.sepia {
      filter: sepia(100%);
    }
    &.border {
      border: 5px dashed #464646
    }
    &.small {
      width: 400px;
    }
  }
  button {
    margin-right: 10px;
    &.active {
      background-color: #dbdbdb;
    }
  }
  h2 {
    margin-bottom: 10px;
  }
  .btn-group {
    margin-bottom: 20px;
  }
  input[type="range"] {
    display: block;
  }

</style>