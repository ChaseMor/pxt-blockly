/**
 * @license
 * PXT Blockly
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * https://github.com/Microsoft/pxt-blockly
 *
 * See LICENSE file for details.
 */

/**
 * @fileoverview The slider class used for field sliders
 * @author Chase Mortensen
 */
'use strict';

goog.provide('Blockly.Slider');
    
Blockly.Slider = function() {
    this.createDom();
    this.mouseDownWrapper = Blockly.bindEvent_(this.element_, "mousedown", this, this.onMouseDown);
}

/**
 * Slider step (The smallest difference of values obtained using the slider).
 * @private
 */
Blockly.Slider.prototype.step_ = 1;

Blockly.Slider.prototype.onMouseDown = function(e) {
    this.updatePosition(e.clientX);
    this.mouseUpWrapper = Blockly.bindEvent_(window, "mouseup", this, this.onMouseUp);
    this.mouseMoveWrapper = Blockly.bindEvent_(window, "mousemove", this, this.onMouseMove);
}
Blockly.Slider.prototype.onMouseMove = function(e) {
    this.updatePosition(e.clientX);
}

Blockly.Slider.prototype.onMouseUp = function(e) {
    Blockly.unbindEvent_(this.mouseUpWrapper);
    Blockly.unbindEvent_(this.mouseMoveWrapper);
}

Blockly.Slider.prototype.updatePosition = function(clientX) {
    var rect = this.element_.getBoundingClientRect();
    var value = clientX - rect.left;
    var sliderWidth = (this.element_).clientWidth;
    var pxPerUnit = (this.max_ - this.min_) / sliderWidth;
    value = value * pxPerUnit;
    if (this.step_ > 1) {
        value = Math.round((value - this.min_) / this.step_) * this.step_ + this.min_;
    } else { // If a step is less than one, multiplying it by the number of notches may result in floating point math errors
        value = Math.round(((value - this.min_) / this.step_) / (Math.round(1000 / this.step_) / 1000)) + this.min_;
    }
    value = Math.min(Math.max(value, this.min_), this.max_);
    this.setValue(value);
    if (this.onChangeEvent) {
        this.onChangeEvent(value);
    }
}

Blockly.Slider.prototype.setVisible = function (visible) {
    this.getElement().style.display = visible ? '' : 'none';
};

Blockly.Slider.prototype.setMinimum = function (min) {
    this.min_ = min;
};

Blockly.Slider.prototype.setMaximum = function (max) {
    this.max_ = max;
};

Blockly.Slider.prototype.setStep = function (step) {
    this.step_ = step;
};

Blockly.Slider.prototype.setMoveToPointEnabled = function (enabled) {
    this.moveToPoint = enabled;
}

Blockly.Slider.prototype.setValue = function (value) {
    this.value_ = value;
    value = Math.min(Math.max(value, this.min_), this.max_)
    var sliderWidth = this.element_.clientWidth;
    var pxPerUnit = sliderWidth / (this.max_ - this.min_);
    value = (value - this.min_) * pxPerUnit - (this.thumb_.clientWidth / 2);
    this.thumb_.style.left = value + "px";
};

Blockly.Slider.prototype.getValue = function () {
    return this.value_;
};

Blockly.Slider.prototype.render = function (parentElement, opt_beforeNode) {
    if (!this.element_) {
        this.createDom();
    }
    parentElement.insertBefore(this.element_, opt_beforeNode || null);
};

Blockly.Slider.prototype.createDom = function () {
    this.element_ = document.createElement('div');
    Blockly.utils.addClass(this.element_, 'slider');
    Blockly.utils.addClass(this.element_, 'slider-horizontal');
    this.thumb_ = document.createElement('div');
    Blockly.utils.addClass(this.thumb_, 'thumb');
    Blockly.utils.addClass(this.thumb_, 'slider-thumb');
    this.element_.appendChild(this.thumb_);
    if (this.onChangeEvent) {
        this.onChangeEvent(this.value_);
    }
};
Blockly.Slider.prototype.getElement = function () {
    return this.element_;
};