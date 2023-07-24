import { getBuildTime } from './getBuildTime.js';
import { enum_RELEASE_CHANNEL } from './releaseChannelEnum.js';
import { readFileSync } from 'node:fs';

/**
 * Retrieves the build number to be used for a NEW build
 * @param {string} channel The release channel to use
 * @returns {string} The build number
 */
export function getBuildNumber(channel = '1') {
  const twoDigitYear = new Date().getFullYear().toString().substring(2);
  const buildTime = getBuildTime();
  const buildNumber = readFileSync('./util/BUILD').toString();
  return `${channel}${twoDigitYear}${buildTime}${buildNumber}`;
}

/**
 * retrieves the version number for a new build
 * @param {boolean} prefixed Whether or not to prefix the version number with a 'v'
 * @returns {string} The version number
 */
export function getVersion(prefixed = false) {
  const prefix = prefixed ? 'v' : '';
  return prefix + readFileSync('../VERSION').toString();
}

/**
 * Retrieves the full version string, including build, for a new build
 * @param {string} channel The release channel to use
 * @returns {string} The full version string
 */
export function getFullVersionString(channel = '1') {
  const suffix = enum_RELEASE_CHANNEL[channel];
  const buildNumber = getBuildNumber(channel);
  const version = getVersion(true);
  return `${version}${suffix} build ${buildNumber}`;
}

/**
 * Retrieves the descriptive version string, excluding build, for a new build
 * @param {string} channel The release channel to use
 * @returns {string} The descriptive version string
 */
export function getDescriptiveVersionString(channel = '1') {
  const version = getVersion(true);
  const suffix = enum_RELEASE_CHANNEL[channel];
  return `${version}${suffix}`;
}
