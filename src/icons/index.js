/**
* @fileOverview 返回所有svg
* @author wind-lc
* @version 1.0
*/

import Vue from 'vue'
import IconSvg from '@/components/IconSvg'

Vue.component('icon-svg', IconSvg)

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
