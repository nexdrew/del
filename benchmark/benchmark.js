/* globals suite, before, bench, after, set */
'use strict';

const cp = require('child_process');
const path = require('path');
const del = require('..');

const numCpus = require('os').cpus().length;

function setup(done) {
	cp.execFile(path.resolve(__dirname, 'setup.sh'), done);
}

function teardown(done) {
	cp.execFile(path.resolve(__dirname, 'teardown.sh'), done);
}

function runAsyncSuite(concurrency, name) {
	if (!name) {
		name = `async concurrency ${concurrency}`;
	}
	suite(name, () => {
		set('iterations', 2);

		const opts = concurrency ? {concurrency} : {};
		const dryRunOpts = Object.assign({dryRun: true}, opts);

		before(setup);

		bench('del tmp/file* -- dry run', next => {
			del('tmp/file*', dryRunOpts).then(next);
		});

		bench('del tmp/*     -- dry run', next => {
			del('tmp/*', dryRunOpts).then(next);
		});

		bench('del tmp/file*', next => {
			del('tmp/file*', opts).then(next);
		});

		bench('del tmp/*', next => {
			del('tmp/*', opts).then(next);
		});

		after(teardown);
	});
}

runAsyncSuite();
runAsyncSuite(1);
runAsyncSuite(4);
runAsyncSuite(numCpus, `async concurrency cpus().length (${numCpus})`);
runAsyncSuite(10);
runAsyncSuite(1000);

suite('sync', () => {
	set('iterations', 2);

	before(setup);

	bench('del tmp/file* -- dry run', () => {
		del.sync('tmp/file*', {dryRun: true});
	});

	bench('del tmp/*     -- dry run', () => {
		del.sync('tmp/*', {dryRun: true});
	});

	bench('del tmp/file*', () => {
		del.sync('tmp/file*');
	});

	bench('del tmp/*', () => {
		del.sync('tmp/*');
	});

	after(teardown);
});
