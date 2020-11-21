/**
 * Array Match
 * 
 * @param {Array} arr1 
 * @param {Array} arr2 
 * 
 * @returns {Boolean}
 */
function arraysMatch(arr1: any[], arr2: any[]) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Diff
 * 
 * @param {Object} obj1 
 * @param {Object} obj2 
 * 
 * @returns {Object}
 */
export function diff(obj1: any, obj2: any) {
	if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
		return obj1;
	}

  const diffs: { [key: string]: any} = {};
  
  function compare(item1: any, item2: any, key: string) {
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);
  
    if (type2 === '[object Undefined]') {
      diffs[key] = null;
      return;
    }
  
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }
  
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2);
  
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
  
      return;
    }
  
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
  
      return;
    }
  
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else {
      if (item1 !== item2) {
        diffs[key] = item2;
      }
    }
  }

	for (let key in obj1) {
    compare(obj1[key], obj2[key], key);
	}

	for (let key in obj2) {
    if (obj1[key] !== obj2[key]) {
      diffs[key] = obj2[key];
    }
	}

	return diffs;
}
