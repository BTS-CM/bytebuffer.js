// encodings/utf8/native

/**
 * Decodes a single UTF8 character from the specified ByteBuffer. The ByteBuffer's offsets remain untouched.
 * @param {!ByteBuffer} bb ByteBuffer to decode from
 * @param {number} offset Offset to start at
 * @returns {!{codePoint: number, length: number}} Decoded char code and the number of bytes read
 * @inner
 * @see http://en.wikipedia.org/wiki/UTF-8#Description
 */
function utf8_decode_char(bb, offset) { //? // Also required for node to extract CStrings and such
    var start = offset,
        a, b, c, d, e, f,
        codePoint;
    //? if (NODE) {
    if (offset+1 > bb.buffer.length)
        throw(new RangeError("Index out of range: "+offset+" + 1 <= "+bb.buffer.length));
    a = bb.buffer[offset++];
    //? } else {
    a = bb.view.getUint8(offset++);
    //? }
    if ((a&0x80) === 0) {
        codePoint = a;
    } else if ((a&0xE0) === 0xC0) {
    //? if (NODE) {
        if (offset+1 > bb.buffer.length)
            throw(new RangeError("Index out of range: "+offset+" + 1 <= "+bb.buffer.length));
        //? if (INLINE)
        b = bb.buffer[offset++];
        //? else
        b = bb.buffer.readUInt8(offset++, true);
    //? } else { // getUint8 asserts on its own
        b = bb.view.getUint8(offset++);
    //? }
        codePoint = ((a&0x1F)<<6) | (b&0x3F);
    } else if ((a&0xF0) === 0xE0) {
    //? if (NODE) {
        if (offset+2 > bb.buffer.length)
            throw(new RangeError("Index out of range: "+offset+" + 2 <= "+bb.buffer.length));
        //? if (INLINE) {
        b = bb.buffer[offset++];
        c = bb.buffer[offset++];
        //? } else {
        b = bb.buffer.readUInt8(offset++, true);
        c = bb.buffer.readUInt8(offset++, true);
        //? }
    //? } else {
        b = bb.view.getUint8(offset++);
        c = bb.view.getUint8(offset++);
    //? }
        codePoint = ((a&0x0F)<<12) | ((b&0x3F)<<6) | (c&0x3F);
    } else if ((a&0xF8) === 0xF0) {
        //? if (NODE) {
        if (offset+3 > bb.buffer.length)
            throw(new RangeError("Index out of range: "+offset+" + 3 <= "+bb.buffer.length));
        b = bb.buffer[offset++];
        c = bb.buffer[offset++];
        d = bb.buffer[offset++];
        //? } else {
        b = bb.view.getUint8(offset++);
        c = bb.view.getUint8(offset++);
        d = bb.view.getUint8(offset++);
        //? }
        codePoint = ((a&0x07)<<18) | ((b&0x3F)<<12) | ((c&0x3F)<<6) | (d&0x3F);
    } else if ((a&0xFC) === 0xF8) {
    //? if (NODE) {
        if (offset+4 > bb.buffer.length)
            throw(new RangeError("Index out of range: "+offset+" + 4 <= "+bb.buffer.length));
        //? if (INLINE) {
        b = bb.buffer[offset++];
        c = bb.buffer[offset++];
        d = bb.buffer[offset++];
        e = bb.buffer[offset++];
        //? } else {
        b = bb.buffer.readUInt8(offset++, true);
        c = bb.buffer.readUInt8(offset++, true);
        d = bb.buffer.readUInt8(offset++, true);
        e = bb.buffer.readUInt8(offset++, true);
        //? }
    //? } else {
        b = bb.view.getUint8(offset++);
        c = bb.view.getUint8(offset++);
        d = bb.view.getUint8(offset++);
        e = bb.view.getUint8(offset++);
    //? }
        codePoint = ((a&0x03)<<24) | ((b&0x3F)<<18) | ((c&0x3F)<<12) | ((d&0x3F)<<6) | (e&0x3F);
    } else if ((a&0xFE) === 0xFC) {
    //? if (NODE) {
        if (offset+5 > bb.buffer.length)
            throw(new RangeError("Index out of range: "+offset+" + 5 <= "+bb.buffer.length));
        //? if (INLINE) {
        b = bb.buffer[offset++];
        c = bb.buffer[offset++];
        d = bb.buffer[offset++];
        e = bb.buffer[offset++];
        f = bb.buffer[offset++];
        //? } else {
        b = bb.buffer.readUInt8(offset++, true);
        c = bb.buffer.readUInt8(offset++, true);
        d = bb.buffer.readUInt8(offset++, true);
        e = bb.buffer.readUInt8(offset++, true);
        f = bb.buffer.readUInt8(offset++, true);
        //? }
    //? } else {
        b = bb.view.getUint8(offset++);
        c = bb.view.getUint8(offset++);
        d = bb.view.getUint8(offset++);
        e = bb.view.getUint8(offset++);
        f = bb.view.getUint8(offset++);
    //? }
        codePoint = ((a&0x01)<<30) | ((b&0x3F)<<24) | ((c&0x3F)<<18) | ((d&0x3F)<<12) | ((e&0x3F)<<6) | (f&0x3F);
    } else
        throw(new RangeError("Illegal code point at offset "+offset+": 0x"+a.toString(16)));
    return {
        'codePoint': codePoint,
        'length': offset - start
    };
}
//? if (!NODE) {

/**
 * Encodes a single UTF8 character to the specified ByteBuffer backed by an ArrayBuffer. The ByteBuffer's offsets are
 *  not modified.
 * @param {number} codePoint Code point to encode
 * @param {!ByteBuffer} bb ByteBuffer to encode to
 * @param {number} offset Offset to write to
 * @returns {number} Number of bytes written
 * @inner
 * @see http://en.wikipedia.org/wiki/UTF-8#Description
 */
function utf8_encode_char(codePoint, bb, offset) {
    var start = offset;
    if (codePoint < 0)
        throw(new RangeError("Illegal code point: -0x"+(-codePoint).toString(16)));
    if (codePoint < 0x80) {
        bb.view.setUint8(offset++,   codePoint     &0x7F)      ;
    } else if (codePoint < 0x800) {
        bb.view.setUint8(offset++, ((codePoint>>6 )&0x1F)|0xC0);
        bb.view.setUint8(offset++, ( codePoint     &0x3F)|0x80);
    } else if (codePoint < 0x10000) {
        bb.view.setUint8(offset++, ((codePoint>>12)&0x0F)|0xE0);
        bb.view.setUint8(offset++, ((codePoint>>6 )&0x3F)|0x80);
        bb.view.setUint8(offset++, ( codePoint     &0x3F)|0x80);
    } else if (codePoint < 0x200000) {
        bb.view.setUint8(offset++, ((codePoint>>18)&0x07)|0xF0);
        bb.view.setUint8(offset++, ((codePoint>>12)&0x3F)|0x80);
        bb.view.setUint8(offset++, ((codePoint>>6 )&0x3F)|0x80);
        bb.view.setUint8(offset++, ( codePoint     &0x3F)|0x80);
    } else if (codePoint < 0x4000000) {
        bb.view.setUint8(offset++, ((codePoint>>24)&0x03)|0xF8);
        bb.view.setUint8(offset++, ((codePoint>>18)&0x3F)|0x80);
        bb.view.setUint8(offset++, ((codePoint>>12)&0x3F)|0x80);
        bb.view.setUint8(offset++, ((codePoint>>6 )&0x3F)|0x80);
        bb.view.setUint8(offset++, ( codePoint     &0x3F)|0x80);
    } else if (codePoint < 0x80000000) {
        bb.view.setUint8(offset++, ((codePoint>>30)&0x01)|0xFC);
        bb.view.setUint8(offset++, ((codePoint>>24)&0x3F)|0x80);
        bb.view.setUint8(offset++, ((codePoint>>18)&0x3F)|0x80);
        bb.view.setUint8(offset++, ((codePoint>>12)&0x3F)|0x80);
        bb.view.setUint8(offset++, ((codePoint>>6 )&0x3F)|0x80);
        bb.view.setUint8(offset++, ( codePoint     &0x3F)|0x80);
    } else
        throw(new RangeError("Illegal code point: 0x"+codePoint.toString(16)));
    return offset - start;
}

/**
 * Calculates the actual number of bytes required to encode the specified char code.
 * @param {number} codePoint Code point to encode
 * @returns {number} Number of bytes required to encode the specified code point
 * @inner
 * @see http://en.wikipedia.org/wiki/UTF-8#Description
 */
function utf8_calc_char(codePoint) {
    if (codePoint < 0)
        throw(new RangeError("Illegal code point: -0x"+(-codePoint).toString(16)));
    if      (codePoint <       0x80) return 1;
    else if (codePoint <      0x800) return 2;
    else if (codePoint <    0x10000) return 3;
    else if (codePoint <   0x200000) return 4;
    else if (codePoint <  0x4000000) return 5;
    else if (codePoint < 0x80000000) return 6;
    else throw(new RangeError("Illegal code point: 0x"+codePoint.toString(16)));
}

/**
 * Calculates the number of bytes required to store an UTF8 encoded string.
 * @param {string} str String to calculate
 * @returns {number} Number of bytes required
 * @inner
 */
function utf8_calc_string(str) {
    var i = 0, cp, n = 0;
    while (i < str.length) {
        n += utf8_calc_char(cp = str.codePointAt(i));
        i += cp < 0xFFFF ? 1 : 2;
    }
    return n;
}

//? }
