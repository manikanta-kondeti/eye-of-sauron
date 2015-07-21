/** @jsx React.DOM */

'use strict'

var React = require('react')
var Header = require('./views/Header')
var LeftSideBar = require('./views/LeftSideBar')

React.renderComponent(<Header />, document.getElementById('header'))

React.renderComponent(<LeftSideBar />,  document.getElementById('left-side-bar'))
