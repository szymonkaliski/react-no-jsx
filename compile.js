"use strict";

var React = require("react");

function compileChildren (children) {
    return children.map(function (child) {
        if ( Array.isArray(child) ) {
            if ( child.length === 0 ) {
                return child;
            } else if ( Array.isArray(child[0]) ) {
                return child.map(compile);
            } else {
                return compile(child);
            }
        }

        return child;
    });
}

function compile (item) {
    var type = item[0];
    var props = item[1];

    var children, id, className;

    if ( typeof(type) === 'string' ) {
        var regex = new RegExp(/([^\s\.#]+)(?:#([^\s\.#]+))?(?:\.([^\s#]+))?/);
        var parsed = type.match(regex);

        type = parsed[1];
        id = parsed[2];
        className = parsed[3] && parsed[3].replace('.', ' ');
    }

    if ( props != null && props.constructor === Object ) {
        children = item.slice(2);
    } else {
        props = {};
        children = item.slice(1);
    }

    props.id = props.id || id;

    if (className) {
        if (props.className) {
            props.className += ' ' + className;
        }
        else {
            props.className = className;
        }
    }

    children = compileChildren(children);

    return React.createElement.apply(React, [type, props].concat(children));
}

module.exports = compile;
