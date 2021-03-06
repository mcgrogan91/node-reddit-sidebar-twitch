const SIDEBAR_STREAMS_HEADER = '- **Live** *streams*';
const SIDEBAR_STREAMS_FOOTER = '- [**.** *see more »*]';

function renderStreams(streams) {
    if (streams.length === 0 ) {
        return "";
    }

    var output = streams.map(s => {
        return `- [**${s.status}** *${s.name}*](${s.url})`;
    }).join('\n');

    return output + "\n";
}

function replaceContent(content, replacement, header, footer) {
    var start = content.indexOf(header);

    if (start === -1) {
        console.log('Header not found: ' + header);
        return;
    }

    start = start + header.length;

    var end = content.indexOf(footer, start);

    var hasNewStreamers = replacement.length > 0;
    var hasOldStreamers = (end - start !== 1);
    if (!hasNewStreamers && !hasOldStreamers) {
        console.log("Nothing to update");
        return;
    }

    if (end === -1) {
        console.log('Footer not found: ' + footer);
        return;
    }

    return content.substring(0, start) +
        '\n' + replacement +
        content.substring(end);
}

function replaceStreams(content, replacement) {
    return replaceContent(
        content,
        replacement,
        SIDEBAR_STREAMS_HEADER,
        SIDEBAR_STREAMS_FOOTER
    );
}

module.exports = {
    renderStreams,
    replaceContent,
    replaceStreams
};
