function after(count, fn) {
    return function() {
        if (count === 0) {
            fn.apply(this, arguments);
        } else {
            count -= 1;
        }
    };
}

module.exports = after;
