// 冒泡排序法(降序)
export function bubbleSort(arr) {
    let max = arr.length - 1;
      for (let j = 0; j < max; j++) {
          // 声明一个变量，作为标志位
          let done = true;
          for (let i = 0; i < max - j; i++) {
              if (arr[i][0] < arr[i + 1][0]) {
                  let temp = arr[i];
                  arr[i] = arr[i + 1];
                  arr[i + 1] = temp;
                  done = false;
              }
          }
          if (done) {
              break;
          }
    }
    return arr;
  }

