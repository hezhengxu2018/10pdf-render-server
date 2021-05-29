/**
 * Gets the size of the specified page, converted from PDF units to inches.
 * @param {Object} An Object containing the properties: {Array} `view`,
 *   {number} `userUnit`, and {number} `rotate`.
 * @returns {Object} An Object containing the properties: {number} `width`
 *   and {number} `height`, given in inches.
 */
const METRIC_PAGE_NAMES = {
  '297x420': 'A3',
  '210x297': 'A4',
}
const US_PAGE_NAMES = {
  '8.5x11': 'Letter',
  '8.5x14': 'Legal',
}
function isPortraitOrientation(size) {
  return size.width <= size.height
}

function getPageName(size, isPortrait, pageNames) {
  const width = isPortrait ? size.width : size.height
  const height = isPortrait ? size.height : size.width

  return pageNames[`${width}x${height}`]
}

function getPageSizeInches({ view, userUnit, rotate }) {
  const [x1, y1, x2, y2] = view
  // We need to take the page rotation into account as well.
  const changeOrientation = rotate % 180 !== 0

  const width = ((x2 - x1) / 72) * userUnit
  const height = ((y2 - y1) / 72) * userUnit

  return {
    width: changeOrientation ? height : width,
    height: changeOrientation ? width : height,
  }
}

async function parsePageSize(_pageSizeInches, pagesRotation) {
  let pageSizeInches = _pageSizeInches
  if (!pageSizeInches) {
    return undefined
  }
  // Take the viewer rotation into account as well; compare with Adobe Reader.
  if (pagesRotation % 180 !== 0) {
    pageSizeInches = {
      width: pageSizeInches.height,
      height: pageSizeInches.width,
    }
  }
  const isPortrait = isPortraitOrientation(pageSizeInches)

  let sizeInches = {
    width: Math.round(pageSizeInches.width * 100) / 100,
    height: Math.round(pageSizeInches.height * 100) / 100,
  }
  // 1in == 25.4mm; no need to round to 2 decimals for millimeters.
  let sizeMillimeters = {
    width: Math.round(pageSizeInches.width * 25.4 * 10) / 10,
    height: Math.round(pageSizeInches.height * 25.4 * 10) / 10,
  }

  let rawName =
    getPageName(sizeInches, isPortrait, US_PAGE_NAMES) ||
    getPageName(sizeMillimeters, isPortrait, METRIC_PAGE_NAMES)

  if (
    !rawName &&
    !(
      Number.isInteger(sizeMillimeters.width) &&
      Number.isInteger(sizeMillimeters.height)
    )
  ) {
    // Attempt to improve the page name detection by falling back to fuzzy
    // matching of the metric dimensions, to account for e.g. rounding errors
    // and/or PDF files that define the page sizes in an imprecise manner.
    const exactMillimeters = {
      width: pageSizeInches.width * 25.4,
      height: pageSizeInches.height * 25.4,
    }
    const intMillimeters = {
      width: Math.round(sizeMillimeters.width),
      height: Math.round(sizeMillimeters.height),
    }

    // Try to avoid false positives, by only considering "small" differences.
    if (
      Math.abs(exactMillimeters.width - intMillimeters.width) < 0.1 &&
      Math.abs(exactMillimeters.height - intMillimeters.height) < 0.1
    ) {
      rawName = getPageName(intMillimeters, isPortrait, METRIC_PAGE_NAMES)
      if (rawName) {
        // Update *both* sizes, computed above, to ensure that the displayed
        // dimensions always correspond to the detected page name.
        sizeInches = {
          width: Math.round((intMillimeters.width / 25.4) * 100) / 100,
          height: Math.round((intMillimeters.height / 25.4) * 100) / 100,
        }
        sizeMillimeters = intMillimeters
      }
    }
  }

  const [{ width, height }, unit, name, orientation] = await Promise.all([
    sizeMillimeters,
    'millimeters',
    rawName,
    isPortrait,
  ])

  return {
    width: width.toLocaleString(),
    height: height.toLocaleString(),
    unit,
    name,
    orientation,
  }
}

module.exports.parsePageSize = parsePageSize
module.exports.getPageSizeInches = getPageSizeInches
