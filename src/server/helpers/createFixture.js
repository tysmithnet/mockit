import fs from 'fs';
import path from 'path';
import fx from 'mkdir-recursive';
import uuidv4 from 'uuid/v4';
import _url from 'url';
import beautify from 'js-beautify';
import config from '../config';

export default function createFixture({
    data,
    filename,
    url,
    description,
    id,
    method,
    status,
    validator,
}) {
    id = id || uuidv4(),
        description = description || 'No description added.';
    method = (method && method.toUpperCase()) || 'GET';
    status = Number(status) || 200;

    const fileName = `${method}-${status}-${filename || id}.fixture.js`;

    const fixture = {
        id,
        method,
        description,
        data,
        status,
        validator,
        url: _url.parse(url).pathname,
    };

    const beautifyOptions = {
        indent_size: 4,
        end_with_newline: true,
    };

    const fixturesFullPath = path.resolve(config.fixturesPath);

    if (!fs.existsSync(fixturesFullPath)) {
        fx.mkdirSync(fixturesFullPath);
    }

    const errs = fs.writeFileSync(
        path.join(fixturesFullPath, fileName),
        beautify(`module.exports = ${JSON.stringify(fixture)}`, beautifyOptions),
    );

    if (!errs) {
        console.log(`Saved file: ${fileName}`);
    } else {
        console.log(errs);
    }
}
