/**
 * Sets the byte order.
 * @param {boolean} littleEndian `true` for little endian byte order, `false` for big endian
 * @returns {!ByteBuffer} this
 * @expose
 */
ByteBuffer.prototype.order = function(littleEndian) {
    if (!this.noAssert) {
        if (typeof littleEndian !== 'boolean')
            throw(new TypeError("Illegal littleEndian: Not a boolean"));
    }
    this.littleEndian = !!littleEndian;
    return this;
};

/**
 * Switches (to) little endian byte order.
 * @param {boolean=} littleEndian Defaults to `true`, otherwise uses big endian
 * @returns {!ByteBuffer} this
 * @expose
 */
ByteBuffer.prototype.LE = function(littleEndian) {
    this.littleEndian = typeof littleEndian !== 'undefined' ? !!littleEndian : true;
    return this;
};

/**
 * Switches (to) big endian byte order.
 * @param {boolean=} bigEndian Defaults to `true`, otherwise uses little endian
 * @returns {!ByteBuffer} this
 * @expose
 */
ByteBuffer.prototype.BE = function(bigEndian) {
    this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;
    return this;
};
