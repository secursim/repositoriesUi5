/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){'use strict';var S={apiVersion:2};S.render=function(r,c){this.startSideNavigation(r,c);this.renderArrowUp(r,c);this.renderItem(r,c);this.renderArrowDown(r,c);this.renderFixedItem(r,c);this.renderFooter(r,c);this.endSideNavigation(r,c);};S.startSideNavigation=function(r,c){var i=c.getAggregation('item');var f=c.getAggregation('fixedItem');var a=c.getExpanded();r.openStart('div',c);r.attr("role",'navigation');r.class('sapTntSideNavigation');r.class("sapContrast");r.class("sapContrastPlus");if(!a){r.class('sapTntSideNavigationNotExpanded');r.class('sapTntSideNavigationNotExpandedWidth');}if(!a&&i){i.setExpanded(false);}if(!a&&f){f.setExpanded(false);}r.openEnd();};S.endSideNavigation=function(r,c){r.close('div');};S.renderArrowUp=function(r,c){r.renderControl(c._getTopArrowControl());};S.renderArrowDown=function(r,c){r.renderControl(c._getBottomArrowControl());};S.renderItem=function(r,c){var i=c.getAggregation('item');r.openStart('div',c.getId()+'-Flexible');r.attr('tabindex','-1');r.class('sapTntSideNavigationFlexible');r.class('sapTntSideNavigationVerticalScrolling');r.openEnd();r.openStart('div',c.getId()+'-Flexible-Content');r.class('sapTntSideNavigationFlexibleContent');r.openEnd();r.renderControl(i);r.close('div');r.close('div');};S.renderFixedItem=function(r,c){var f=c.getAggregation('fixedItem');if(f===null){return;}if(f.getExpanded()===false){f.setExpanded(false);}r.openStart('div');r.attr('role','separator');r.attr('aria-orientation','horizontal');r.class('sapTntSideNavigationSeparator');r.openEnd();r.close('div');r.openStart('div');r.class('sapTntSideNavigationFixed');r.openEnd();r.renderControl(f);r.close('div');};S.renderFooter=function(r,c){if(c.getAggregation('footer')){r.openStart('footer');r.class('sapTntSideNavigationFooter');r.openEnd();r.renderControl(c.getAggregation('footer'));r.close('footer');}};return S;},true);