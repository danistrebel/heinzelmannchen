var ColorPicker = (function () {
    function ColorPicker() {
        this.restrict = 'E';
        this.templateUrl = 'views/colorpicker.html';
        this.replace = true;
        this.scope = {
            color: '=',
            onColorChange: '='
        };
        this.link = function (scope, element, attrs) {
            var allColors = ['#64dd17', '#dc3912', '#ff9900', '#109618', '#990099', '#0099c6', '#dd4477'];
            var input = document.createElement('input');
            input.setAttribute('type', 'color');
            scope.supportsColorInput = input.type === 'color';
            scope.toggleColor = function () {
                if (scope.supportsColorInput) {
                    return;
                }
                var currentColorIndex = allColors.indexOf(scope.color);
                var nextColorIndex = ((currentColorIndex >= 0 ? currentColorIndex : 0) + 1) % allColors.length;
                scope.color = allColors[nextColorIndex];
                scope.onColorChange();
            };
        };
    }
    return ColorPicker;
})();
angular.module('heinzelmannchen').directive('colorPicker', function () { return new ColorPicker(); });