/**
 * Create Style Elements
 *
 * @param {IElementRepresentation[]}
 *
 * @return {ICtorStyle}
 */
export function ExFStylize(children) {
    var content = createStyleContent(children);
    var styles = content.map(function (text) {
        var style = document.createElement('style');
        style.textContent = text;
        return style;
    });
    return { styles: styles, content: content };
}
/**
 * Create text content for style element
 *
 * @param {IElementRepresentation[]}
 *
 * @return {String[]}
 */
function createStyleContent(children) {
    var allStyles = children.reduce(function (arr, child) {
        if (typeof child === 'string') {
            if (arr.length > 0) {
                arr[arr.length - 1] += ' }';
            }
            arr.push(child.trim() + " {");
        }
        else {
            Object.keys(child).forEach(function (key) {
                arr[arr.length - 1] += " " + key + ": " + child[key] + ";";
            });
        }
        return arr;
    }, []);
    allStyles[allStyles.length - 1] += ' }';
    return allStyles;
}
/**
 * Compare old and new style content and return commit function
 *
 * @param {ICtorStyle} style
 * @param {IElementRepresentation[]} rep
 *
 * @return {Function}
 */
export function extractStyleChanges(style, rep) {
    var styles = style.styles, content = style.content;
    var newStyles = createStyleContent(rep);
    var changes = [];
    newStyles.forEach(function (text, i) {
        if (text !== content[i]) {
            changes.push({ element: styles[i], content: text });
        }
    });
    return {
        rep: newStyles,
        commit: function () {
            changes.forEach(function (_a) {
                var element = _a.element, content = _a.content;
                element.textContent = content;
            });
        },
    };
}
//# sourceMappingURL=virtualStyleBuilder.js.map