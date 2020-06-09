/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device','sap/ui/base/EventProvider','sap/ui/core/InvisibleText','sap/ui/core/ListItem','sap/ui/core/ResizeHandler','sap/ui/core/ValueStateSupport','sap/m/library','sap/ui/core/library','sap/m/Bar','sap/m/Toolbar','sap/m/Button','sap/m/ToggleButton','sap/m/ColumnListItem','sap/m/GroupHeaderListItem','sap/ui/core/SeparatorItem','sap/m/Dialog','sap/m/DisplayListItem','sap/m/List','sap/m/Popover','sap/m/StandardListItem','sap/m/Table','sap/m/Title','sap/ui/core/IconPool',"sap/base/security/encodeXML","sap/ui/events/KeyCodes","sap/m/ValueStateHeader"],function(D,E,I,L,R,V,l,c,B,T,a,b,C,G,S,d,e,f,P,g,h,j,k,m,K,n){"use strict";var o=l.ListMode;var p=l.PlacementType;var q=l.ListType;var r=l.ListSeparators;var s="sapMSuggestionsPopover",t="sapUiNoContentPadding";var u=c.ValueState;var v=E.extend("sap.m.SuggestionsPopover",{constructor:function(i){E.apply(this,arguments);this._oInput=i;this._bHasTabularSuggestions=false;this._bUseDialog=D.system.phone;this._iPopupListSelectedIndex=-1;this._sPopoverContentWidth=null;this._bEnableHighlighting=true;this._bIsInputIncrementalType=false;this._bAutocompleteEnabled=false;this._sTypedInValue='';this._sOldValueState=u.None;this._oInput.addEventDelegate({onsapup:function(w){this._onsaparrowkey(w,"up",1);},onsapdown:function(w){this._onsaparrowkey(w,"down",1);},onsappageup:function(w){this._onsaparrowkey(w,"up",5);},onsappagedown:function(w){this._onsaparrowkey(w,"down",5);},onsaphome:function(w){if(this._oList){this._onsaparrowkey(w,"up",this._oList.getItems().length);}},onsapend:function(w){if(this._oList){this._onsaparrowkey(w,"down",this._oList.getItems().length);}},onsapright:this._onsapright,onsaptabnext:this._handleInputsTabNext},this);},destroy:function(){if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}if(this._oList){this._oList.destroy();this._oList=null;}this._oProposedItem=null;this._oInputDelegate=null;this._oValueStateHeader=null;if(this._oPickerValueStateText){this._oPickerValueStateText.destroy();this._oPickerValueStateText=null;}}});v.M_EVENTS={SELECTION_CHANGE:"selectionChange"};v._wordStartsWithValue=function(i,w){var x;if(!i||!w||typeof i!=="string"||typeof w!=="string"){return false;}while(i){if(typeof w==="string"&&w!==""&&i.toLowerCase().indexOf(w.toLowerCase())===0){return true;}x=i.indexOf(' ');if(x===-1){break;}i=i.substring(x+1);}return false;};v._DEFAULTFILTER=function(i,w){if(w instanceof L&&v._wordStartsWithValue(w.getAdditionalText(),i)){return true;}return v._wordStartsWithValue(w.getText(),i);};v.prototype.isOpen=function(){return this._oPopover&&this._oPopover.isOpen();};v.prototype.setInputLabels=function(i){this._fnInputLabels=i;};v.prototype._getInputLabels=function(){return this._fnInputLabels();};v.prototype._getScrollableContent=function(){return this._oPopover&&this._oPopover.getDomRef("scroll");};v.prototype.updatePickerHeaderTitle=function(){var i=sap.ui.getCore().getLibraryResourceBundle("sap.m"),w=this.getPickerTitle(),x,y;if(!w){return;}y=this._getInputLabels();if(y.length){x=y[0];if(x&&(typeof x.getText==="function")){w.setText(x.getText());}}else{w.setText(i.getText("COMBOBOX_PICKER_TITLE"));}return w;};v.prototype.getPickerTitle=function(){return this._oPopover.getCustomHeader().getContentMiddle()[0];};v.prototype.getOkButton=function(){var i=this._oPopover&&this._oPopover.getBeginButton();return i||null;};v.prototype.getCancelButton=function(){var i=this._oPopover&&this._oPopover.getCustomHeader()&&this._oPopover.getCustomHeader().getContentRight&&this._oPopover.getCustomHeader().getContentRight()[0];return i||null;};v.prototype.getFilterSelectedButton=function(){var i=this._oPopover&&this._oPopover.getSubHeader()&&this._oPopover.getSubHeader().getContent()[1];return i||null;};v.prototype._createFilterSelectedButton=function(){var i=k.getIconURI("multiselect-all");return new b({icon:i});};v.prototype._createSuggestionPopup=function(O){O=O||[];var i=this._oInput,w=this,M=i._oRb;this._oPopover=!this._bUseDialog?(new P(i.getId()+"-popup",{showArrow:false,placement:p.VerticalPreferredBottom,showHeader:true,initialFocus:i,horizontalScrolling:true,beforeClose:function(){if(w.bMessageValueStateActive){w._getValueStateHeader().removeStyleClass("sapMPseudoFocus");this.bMessageValueStateActive=false;}}})):(new d(i.getId()+"-popup",{beginButton:new a(i.getId()+"-popup-closeButton",{text:M.getText("SUGGESTIONSPOPOVER_CLOSE_BUTTON")}),stretch:true,customHeader:new B(i.getId()+"-popup-header",{contentMiddle:new j(),contentRight:new a({icon:k.getIconURI("decline")})}),subHeader:this.createSubHeaderContent(O),horizontalScrolling:false,initialFocus:this._oPopupInput,beforeOpen:function(){w.updatePickerHeaderTitle();},afterClose:function(){i.focus();l.closeKeyboard();}}));this._registerAutocomplete();this._oPopover.addStyleClass(s);this._oPopover.addStyleClass(t);this._oPopover.addAriaLabelledBy(I.getStaticId("sap.m","INPUT_AVALIABLE_VALUES"));if(!this._bUseDialog){this._overwritePopover();}if(this._oList){this._oPopover.addContent(this._oList);}};v.prototype.createSubHeaderContent=function(O){var i=[this._oPopupInput];if(O.showSelectedButton){i.push(this._createFilterSelectedButton());}return new T({content:i});};v.prototype._createSuggestionPopupContent=function(i){var w=this._oInput;this._bHasTabularSuggestions=i;if(!i){this._oList=new f(w.getId()+"-popup-list",{showNoData:false,mode:o.SingleSelectMaster,rememberSelections:false,width:"100%",showSeparators:r.None,busyIndicatorDelay:0});this._oList.addEventDelegate({onAfterRendering:function(){var z,A;if(!this._bEnableHighlighting){return;}z=this._oList.$().find('.sapMDLILabel, .sapMSLITitleOnly, .sapMDLIValue');A=(this._sTypedInValue||this._oInput.getValue()).toLowerCase();this.highlightSuggestionItems(z,A);}.bind(this)});}else{this._oList=this._oInput._getSuggestionsTable();}if(this._oPopover){if(this._bUseDialog){this._oPopover.addAggregation("content",this._oList,true);var x=this._oPopover.$("scrollCont")[0];if(x){var y=sap.ui.getCore().createRenderManager();y.renderControl(this._oList);y.flush(x);y.destroy();}}else{this._oPopover.addContent(this._oList);}}};v.prototype._getValueStateHeader=function(){if(!this._oValueStateHeader){this._oValueStateHeader=new n();if(this._oPopover.isA("sap.m.Popover")){this._oPopover.setCustomHeader(this._oValueStateHeader);}else{this._oPopover.insertContent(this._oValueStateHeader,0);}this._oValueStateHeader.setPopup(this._oPopover);}return this._oValueStateHeader;};v.prototype._destroySuggestionPopup=function(){if(this._oPopover){if(this._oList instanceof h){this._oPopover.removeAllContent();}this._oPopover.destroy();this._oPopover=null;}if(this._oList instanceof f){this._oList.destroy();this._oList=null;}if(this._oPickerValueStateText){this._oPickerValueStateText.destroy();this._oPickerValueStateText=null;}if(this._oValueStateHeader){this._oValueStateHeader.destroy();this._oValueStateHeader=null;}this._getInput().removeEventDelegate(this._oInputDelegate,this);};v.prototype._overwritePopover=function(){var i=this._oInput;this._oPopover.open=function(){this.openBy(i,false,true);};this._oPopover.oPopup.setAnimations(function($,w,O){O();},function($,w,x){x();});};v.prototype._resizePopup=function(){var i=this._oInput;if(this._oList&&this._oPopover){if(this._sPopoverContentWidth){this._oPopover.setContentWidth(this._sPopoverContentWidth);}else{this._oPopover.setContentWidth((i.$().outerWidth())+"px");}setTimeout(function(){if(this._oPopover&&this._oPopover.isOpen()&&this._oPopover.$().outerWidth()<i.$().outerWidth()){this._oPopover.setContentWidth((i.$().outerWidth())+"px");}}.bind(this),0);}};v.prototype._registerResize=function(){if(!this._bUseDialog){this._sPopupResizeHandler=R.register(this._oInput,this._resizePopup.bind(this));}};v.prototype._deregisterResize=function(){if(this._sPopupResizeHandler){this._sPopupResizeHandler=R.deregister(this._sPopupResizeHandler);}};v.prototype.closePopoverDelegate={onsaptabnext:function(i){this.bMessageValueStateActive=false;this._oInput.onsapfocusleave(i);this._oPopover.close();setTimeout(function(){this._oInput.closeValueStateMessage();}.bind(this),0);}};v.prototype._handleInputsTabNext=function(i){if(!this.bMessageValueStateActive||!this.getValueStateLinks().length||(this.bMessageValueStateActive&&document.activeElement.tagName==="A")){return;}var w=this.getValueStateLinks(),x=w[w.length-1];i.preventDefault();w[0].focus();this._getValueStateHeader().removeStyleClass("sapMPseudoFocus");x.addDelegate(this.closePopoverDelegate,this);};v.prototype._onsaparrowkey=function(i,w,x){var y=this._oInput,z,A=y.$("inner");if(i.isMarked()){return;}if(i.isMarked()){return;}if(!y.getEnabled()||!y.getEditable()){return;}if(w!=="up"&&w!=="down"){return;}if(this._bIsInputIncrementalType){i.setMarked();}if(!this._oPopover||!this._oPopover.isOpen()){return;}i.preventDefault();i.stopPropagation();var F=false,H=this._oList,J=H.getItems(),M=H.getSelectedItem(),N=this._iPopupListSelectedIndex,O,Q=this._getValueStateHeader(),U=Q.getFormattedText(),W=D.browser.msie?U:Q,X=N;if(w=="down"&&N===J.length-1){return;}var Y;if(x>1){if(w=="down"&&N+x>=J.length){w="up";x=1;J[N].setSelected(false);J[N].removeStyleClass("sapMLIBFocused");Y=N;N=J.length-1;F=true;}else if(w=="up"&&N-x<0&&N>=0){w="down";x=1;J[N].setSelected(false);J[N].removeStyleClass("sapMLIBFocused");Y=N;N=0;F=true;}}y.removeStyleClass("sapMFocus");this._oList.addStyleClass("sapMListFocus");if(N===-1){N=0;if(this._isSuggestionItemSelectable(J[N])){X=N;F=true;}else{w="down";}}if(w==="down"){while(N<J.length-1&&(!F||!this._isSuggestionItemSelectable(J[N]))){J[N].setSelected(false);J[N].removeStyleClass("sapMLIBFocused");N=N+x;F=true;x=1;if(Y===N){break;}}}else{while(N>0&&(!F||!J[N].getVisible()||!this._isSuggestionItemSelectable(J[N]))){J[N].setSelected(false);J[N].removeStyleClass("sapMLIBFocused");N=N-x;F=true;x=1;if(Y===N){break;}}}if((w==="up"&&this.getValueStateLinks().length&&!this.bMessageValueStateActive)&&(!this._isSuggestionItemSelectable(J[N])||X===0)){W.addStyleClass(("sapMPseudoFocus"));y.removeStyleClass("sapMFocus");A.attr("aria-activedescendant",U.getId());this.bMessageValueStateActive=true;this._iPopupListSelectedIndex=-1;return;}if((this.getValueStateLinks().length&&this.bMessageValueStateActive)&&(w==="up"&&N===0||w==="down")){W.removeStyleClass("sapMPseudoFocus");y.addStyleClass("sapMFocus");this.bMessageValueStateActive=false;}if(!this._isSuggestionItemSelectable(J[N])){if(X>=0){J[X].setSelected(true).updateAccessibilityState();A.attr("aria-activedescendant",J[X].getId());J[X].addStyleClass("sapMLIBFocused");}return;}else{z=J[N];z.setSelected(true).updateAccessibilityState();z.addStyleClass("sapMLIBFocused");if(z.isA("sap.m.GroupHeaderListItem")){A.removeAttr("aria-activedescendant");}else{A.attr("aria-activedescendant",J[N].getId());}}if(D.system.desktop){this._scrollToItem(N);}this._oLastSelectedHeader&&this._oLastSelectedHeader.removeStyleClass("sapMInputFocusedHeaderGroup");if(C&&J[N]instanceof C){O=y._getInputValue(y._fnRowResultFilter(J[N]));}else{if(J[N].isA("sap.m.GroupHeaderListItem")){O="";J[N].addStyleClass("sapMInputFocusedHeaderGroup");M&&M.setSelected(false);this._oLastSelectedHeader=J[N];}else if(J[N]instanceof e){O=y._getInputValue(J[N].getLabel());}else{O=y._getInputValue(J[N].getTitle());}}this._iPopupListSelectedIndex=N;this._bSuggestionItemChanged=true;this.fireEvent(v.M_EVENTS.SELECTION_CHANGE,{newValue:O});};v.prototype.getValueStateLinks=function(){var H=this._getValueStateHeader(),F=H&&typeof H.getFormattedText==="function"&&H.getFormattedText(),i=F&&typeof F.getControls==="function"&&F.getControls();return i||[];};v.prototype._isSuggestionItemSelectable=function(i){var w=this._bHasTabularSuggestions||i.getType()!==q.Inactive||i.isA("sap.m.GroupHeaderListItem");return i.getVisible()&&w;};v.prototype.setOkPressHandler=function(H){var O=this.getOkButton();O&&O.attachPress(H);return O;};v.prototype.setCancelPressHandler=function(H){var i=this.getCancelButton();i&&i.attachPress(H);};v.prototype.setShowSelectedPressHandler=function(H){var F=this.getFilterSelectedButton();F&&F.attachPress(H);return F;};v.prototype._scrollToItem=function(i){var w=this._oPopover,x=this._oList,y,z,A,F,H;if(!(w instanceof P)||!x){return;}y=w.getScrollDelegate();if(!y){return;}var J=x.getItems()[i],M=J&&J.getDomRef();if(!M){return;}z=w.getDomRef("cont").getBoundingClientRect();A=M.getBoundingClientRect();F=z.top-A.top;H=A.bottom-z.bottom;if(F>0){y.scrollTo(y._scrollX,Math.max(y._scrollY-F,0));}else if(H>0){y.scrollTo(y._scrollX,y._scrollY+H);}};v.prototype._createHighlightedText=function(i,w,W){var x,y,z,N,A,F=i?i.innerText:"",H="";if(!v._wordStartsWithValue(F,w)){return m(F);}w=w.toLowerCase();z=w.length;while(v._wordStartsWithValue(F,w)){x=F.toLowerCase();y=x.indexOf(w);y=(y>0)?x.indexOf(' '+w)+1:y;A=F.substring(0,y);F=F.substring(y);H+=m(A);A=F.substring(0,z);F=F.substring(z);H+='<span class="sapMInputHighlight">'+m(A)+'</span>';N=F.indexOf(" ");N=N===-1?F.length:N;A=F.substring(0,N);F=F.substring(N);H+=m(A);if(!W){break;}}if(F){H+=m(F);}return H;};v.prototype.highlightSuggestionItems=function(w,x,W){var i;if(!this._bEnableHighlighting||(!w&&!w.length)){return;}for(i=0;i<w.length;i++){w[i].innerHTML=this._createHighlightedText(w[i],x,W);}};v.prototype._registerAutocomplete=function(){var i=this._oPopover,U=this._getInput(),w=this._bUseDialog;if(w){i.addEventDelegate({ontap:function(){if(!this._bSuggestionItemTapped&&this._sProposedItemText){U.setValue(this._sProposedItemText);this._sProposedItemText=null;}}},this);}else{i.attachAfterOpen(this._handleTypeAhead,this);}i.attachAfterOpen(this._setSelectedSuggestionItem,this);i.attachAfterClose(this._finalizeAutocomplete,this);this._oInputDelegate={onkeydown:function(x){this._bDoTypeAhead=!D.os.android&&this._bAutocompleteEnabled&&(x.which!==K.BACKSPACE)&&(x.which!==K.DELETE);},oninput:this._handleTypeAhead};U.addEventDelegate(this._oInputDelegate,this);};v.prototype._handleTypeAhead=function(){var w=this._getInput(),x=w.getValue();this._oProposedItem=null;this._sProposedItemText=null;this._sTypedInValue=x;if(!this._bDoTypeAhead||x===""){return;}if(!this._oPopover.isOpen()||x.length<this._oInput.getStartSuggestion()){return;}if(document.activeElement!==w.getFocusDomRef()){return;}var y=x.toLowerCase(),z=this._bHasTabularSuggestions?this._oInput.getSuggestionRows():this._oInput.getSuggestionItems(),A,N,F,i;z=z.filter(function(H){return!(H.isA("sap.ui.core.SeparatorItem")||H.isA("sap.m.GroupHeaderListItem"));});A=z.length;for(i=0;i<A;i++){F=this._bHasTabularSuggestions?this._oInput._fnRowResultFilter(z[i]):z[i].getText();if(F.toLowerCase().indexOf(y)===0){this._oProposedItem=z[i];N=F;break;}}this._sProposedItemText=N;if(N){N=this._formatTypedAheadValue(N);if(!w.isComposingCharacter()){w.updateDomValue(N);}if(D.system.desktop){w.selectText(x.length,N.length);}else{setTimeout(function(){w.selectText(x.length,N.length);},0);}}};v.prototype._setSelectedSuggestionItem=function(){var F;if(this._oList){F=this._oList.getItems();for(var i=0;i<F.length;i++){if((F[i]._oItem||F[i])===this._oProposedItem){F[i].setSelected(true);break;}}}};v.prototype._getInput=function(){return this._bUseDialog?this._oPopupInput:this._oInput;};v.prototype._finalizeAutocomplete=function(){if(this._oInput.isComposingCharacter()){return;}if(!this._bAutocompleteEnabled){return;}if(!this._bSuggestionItemTapped&&!this._bSuggestionItemChanged&&this._oProposedItem){if(this._bHasTabularSuggestions){this._oInput.setSelectionRow(this._oProposedItem,true);}else{this._oInput.setSelectionItem(this._oProposedItem,true);}}if(this._oProposedItem&&document.activeElement===this._oInput.getFocusDomRef()){var i=this._oInput.getValue().length;this._oInput.selectText(i,i);}this._resetTypeAhead();};v.prototype._resetTypeAhead=function(){this._oProposedItem=null;this._sProposedItemText=null;this._sTypedInValue='';this._bSuggestionItemTapped=false;this._bSuggestionItemChanged=false;};v.prototype._formatTypedAheadValue=function(N){return this._sTypedInValue.concat(N.substring(this._sTypedInValue.length,N.length));};v.prototype._onsapright=function(){var i=this._oInput,w=i.getValue();if(!this._bAutocompleteEnabled){return;}if(this._sTypedInValue!==w){this._sTypedInValue=w;i.fireLiveChange({value:w,newValue:w});}};v.prototype.updateValueState=function(i,w,x){var y=x&&i!==u.None;w=w||V.getAdditionalText(i);if(!this._oPopover){return this;}if(this._oPopupInput){this._oPopupInput.setValueState(i);}this._getValueStateHeader().setValueState(i);this._setValueStateHeaderText(w);this._showValueStateHeader(y);this._alignValueStateStyles(i);return this;};v.prototype._showValueStateHeader=function(i){if(this._oValueStateHeader){this._oValueStateHeader.setVisible(i);}};v.prototype._setValueStateHeaderText=function(i){if(this._oValueStateHeader&&typeof i==="string"){this._oValueStateHeader.setText(i);}else if(this._oValueStateHeader&&typeof i==="object"){this._oValueStateHeader.setFormattedText(i);}};v.prototype._alignValueStateStyles=function(i){var w=s+"ValueState",O=s+this._sOldValueState+"State",x=s+i+"State";this._oPopover.addStyleClass(w);this._oPopover.removeStyleClass(O);this._oPopover.addStyleClass(x);this._sOldValueState=i;};v.prototype.addContent=function(i){this._oPopover.addContent(i);};return v;});