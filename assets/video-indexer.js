'use strict'

const _Promise = require('bluebird');
const _Request = _Promise.promisifyAll(require('request'));
const _uuid = require('uuid');
const apiurl = "https://videobreakdown.azure-api.net/Breakdowns/Api/Partner";
const _fileURL = require('file-url');
const _fs = require('fs');
const _path = require('path');

var Vindexer = function(apikey) { 
    this.apiKey = apikey; 
    }

Vindexer.prototype.getAccounts = function() {
    return _Request.getAsync({
        url: `${apiurl}/Accounts`,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.deleteBreakdown = function(id, params) {
    return _Request.deleteAsync({
        url: `${apiurl}/Breakdowns/${id}`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.getBreakdown = function(id, params) {
    return _Request.getAsync({
        url: `${apiurl}/Breakdowns/${id}`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.getInsightsWidgetUrl = function(id, params) {
    return _Request.getAsync({
        url: `${apiurl}/Breakdowns/${id}/InsightsWidgetUrl`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.getInsightsWidgetUrlByExternalId = function(externalid, params) {
    return _Request.getAsync({
        url: `${apiurl}/Breakdowns/${externalid}/GetInsightsWidgetUrlByExternalId`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.getPlayerWidgetUrl = function(id) {
    return _Request.getAsync({
        url: `${apiurl}/Breakdowns/${id}/PlayerWidgetUrl`,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.getProcessingState = function(id) {
    return _Request.getAsync({
        url: `${apiurl}/Breakdowns/${id}/State`,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.getVttUrl = function(id, params) {
    return _Request.getAsync({
        url: `${apiurl}/Breakdowns/${id}/VttUrl`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.reindexBreakdown = function(id, params) {
    return _Request.putAsync({
        url: `${apiurl}/Breakdowns/reindex/${id}`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.reIndexBreakdownByExternalId = function(externalid, params) {
    return _Request.putAsync({
        url: `${apiurl}/Breakdowns/reindexbyexternalid/${externalid}`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.search = function(params) {
    return _Request.getAsync({
        url: `${apiurl}/Breakdowns/Search`,
        qs: params,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.updateFaceName = function(id, faceid, name) {
    return _Request.putAsync({
        url: `${apiurl}/Breakdowns/UpdateFaceName/${id}?${faceid}&${name}`,
        headers: { "Ocp-Apim-Subscription-Key": this.apiKey }
    })
}

Vindexer.prototype.uploadVideo = function(videoUrl, params) {
// Work in progress: only accepts video by URL
    params.videoUrl = videoUrl;
    if (!params.name) { params.name = `video_${_uuid.v4()}`; }
    if (!params.privacy) { params.privacy = 'Private'; }
    return _Request.postAsync({
        url: `${apiurl}/Breakdowns`,
        qs: params,
        headers: {  
            "Content-Type": "multipart/form-data",
            "Ocp-Apim-Subscription-Key": this.apiKey
        },
        formData: {}
    })
}

Vindexer.prototype.uploadFile = function(fileName, params) {
    // Work in progress: only accepts video by URL

    console.log('FileName:' + fileName);
    console.log('Name:' + _path.basename(fileName));
    if (!params.name) { params.name = _path.basename(fileName); }
    if (!params.privacy) { params.privacy = 'Public'; }
        return _Request.postAsync({
            url: `${apiurl}/Breakdowns`,
            qs: params,
            timeout: 30000,
            headers: {  
                "Content-Type": "multipart/form-data",
                "Ocp-Apim-Subscription-Key": this.apiKey
            },
            formData: {
                name: 'file1',
                file: {
                    value: _fs.createReadStream(fileName),
                    options: {
                        filename: _path.basename(fileName),
                        contentType: 'video/mp4'
                    }
                }

            }
        })
        console.log('finished');
    }
    
module.exports = Vindexer;
