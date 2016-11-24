/*  Copyright 2016 Where Ideas Simply Come True, S.L.
 *  https://github.com/wiscot/jquery-curved-text
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
$.fn.curvedText = function(options)
{
    var actions = arguments;

    var curve = function(container, text, options)
    {
        container.innerHTML = null;
        if (text.length > 0) {
            var letters = new Array();
            var textSize = 0;
            var maxHeight = 0;
            var fullText = document.createElement('span');
            fullText.innerHTML = text;
            container.appendChild(fullText);
            var fullSize = fullText.offsetWidth;
            container.removeChild(fullText);
            // Calculate text size in pixels and creates a span for each character in the string
            for (var i = 0; i < text.length; i++) {
                var letter = document.createElement('span');
                letter.style.position = 'absolute';
                letter.style.display = 'inline-block';
                var c = text.substr(i, 1);
                if (c === ' ') {
                    c = '&nbsp;';
                }
                letter.innerHTML = c;
                letters.push(letter);
                container.appendChild(letter);
                textSize += letter.offsetWidth;
                maxHeight = Math.max(maxHeight, letter.offsetHeight);
            }
            // Calculates final circle metrics
            var ox = 0;
            switch (options.position[0]) {
                case "left": ox = 0; break;
                case "right": ox = container.offsetWidth; break;
                case "center": ox = container.offsetWidth / 2; break;
                default: ox = (options.position[0] * 1);
            }
            var oy = 0;
            switch (options.position[1]) {
                case "top": oy = 0; break;
                case "center": oy = container.offsetHeight / 2; break;
                case "bottom": oy = container.offsetHeight; break;
                default: oy = (options.position[1] * 1);
            }
            var radius = 0;
            switch (options.radius) {
                case "auto": radius = Math.min(container.offsetWidth, container.offsetHeight) / 2; break;
                default: radius = (options.radius * 1);
            }
            var perimeter = Math.round(Math.PI * radius * 2);
            var arc = fullSize % perimeter;
            var angle = arc * 360 / perimeter;
            var pointdeg = angle / arc;
            var align = 0;
            var height = Math.round(radius + maxHeight);
            var letterSpacing = (textSize === fullSize  || letters.length === 1 ? 0 : (fullSize - textSize) / (letters.length - 1));
            switch (options.align) {
                case "left": align = 0; break;
                case "right": align = -angle; break;
                case "center": align = -(angle / 2); break;
                default: align = (options.align * 1);
            }
            align += (options.rotate * 1);
            var cursor = align;
            for (var i in letters) {
                var letter = letters[i];
                letter.style.height = height + "px";
                letter.style.left = ox + "px";
                letter.style.transformOrigin = options.position[0] + ' ' + options.position[1]; //ox + "px " + oy + "px";
                letter.style.transform = "rotate(" + (Math.round(cursor * 1000) / 1000) + "deg)";
                cursor += pointdeg * (letter.offsetWidth + letterSpacing);
            }
        }
    };

    return this.each(function() {
        if (actions.length === 0 || options instanceof Array || options instanceof Object) {
            var opts = $.extend({}, $.fn.curvedText.defaults, options);
            var data = $(this).data();
            this.curvedTextOptions = $.extend(opts, data);
            curve(this, $(this).text(), this.curvedTextOptions);
        } else if (actions.length === 1 && (typeof actions[0]) === 'string' && (typeof this.curvedTextOptions) !== 'undefined') {
            curve(this, actions[0], this.curvedTextOptions);
        }
    });
};

$.fn.curvedText.defaults = {
    "rotate": 0,
    "align": "center",
    "position": ["50%", "50%"],
    "radius": "auto"
};
