"use strict";

exports.__esModule = true;
exports.contentfulAssetSizesPreferWebpNoBase64 = exports.contentfulAssetSizesPreferWebp = exports.contentfulAssetSizesNoBase64 = exports.contentfulAssetSizesTracedSVG = exports.contentfulAssetSizes = exports.contentfulAssetResolutionsPreferWebpNoBase64 = exports.contentfulAssetResolutionsPreferWebp = exports.contentfulAssetResolutionsNoBase64 = exports.contentfulAssetResolutionsTracedSVG = exports.contentfulAssetResolutions = exports.contentfulAssetFluidPreferWebpNoBase64 = exports.contentfulAssetFluidPreferWebp = exports.contentfulAssetFluidNoBase64 = exports.contentfulAssetFluidTracedSVG = exports.contentfulAssetFluid = exports.contentfulAssetFixedPreferWebpNoBase64 = exports.contentfulAssetFixedPreferWebp = exports.contentfulAssetFixedNoBase64 = exports.contentfulAssetFixedTracedSVG = exports.contentfulAssetFixed = void 0;

var _gatsby = require("gatsby");

const contentfulAssetFixed = _gatsby.graphql`
  fragment GatsbyContentfulFixed on ContentfulFixed {
    base64
    width
    height
    src
    srcSet
  }
`;
exports.contentfulAssetFixed = contentfulAssetFixed;
const contentfulAssetFixedTracedSVG = _gatsby.graphql`
  fragment GatsbyContentfulFixed_tracedSVG on ContentfulFixed {
    tracedSVG
    width
    height
    src
    srcSet
  }
`;
exports.contentfulAssetFixedTracedSVG = contentfulAssetFixedTracedSVG;
const contentfulAssetFixedNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulFixed_noBase64 on ContentfulFixed {
    width
    height
    src
    srcSet
  }
`;
exports.contentfulAssetFixedNoBase64 = contentfulAssetFixedNoBase64;
const contentfulAssetFixedPreferWebp = _gatsby.graphql`
  fragment GatsbyContentfulFixed_withWebp on ContentfulFixed {
    base64
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`;
exports.contentfulAssetFixedPreferWebp = contentfulAssetFixedPreferWebp;
const contentfulAssetFixedPreferWebpNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulFixed_withWebp_noBase64 on ContentfulFixed {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`;
exports.contentfulAssetFixedPreferWebpNoBase64 = contentfulAssetFixedPreferWebpNoBase64;
const contentfulAssetFluid = _gatsby.graphql`
  fragment GatsbyContentfulFluid on ContentfulFluid {
    base64
    aspectRatio
    src
    srcSet
    sizes
  }
`;
exports.contentfulAssetFluid = contentfulAssetFluid;
const contentfulAssetFluidTracedSVG = _gatsby.graphql`
  fragment GatsbyContentfulFluid_tracedSVG on ContentfulFluid {
    tracedSVG
    aspectRatio
    src
    srcSet
    sizes
  }
`;
exports.contentfulAssetFluidTracedSVG = contentfulAssetFluidTracedSVG;
const contentfulAssetFluidNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulFluid_noBase64 on ContentfulFluid {
    aspectRatio
    src
    srcSet
    sizes
  }
`;
exports.contentfulAssetFluidNoBase64 = contentfulAssetFluidNoBase64;
const contentfulAssetFluidPreferWebp = _gatsby.graphql`
  fragment GatsbyContentfulFluid_withWebp on ContentfulFluid {
    base64
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`;
exports.contentfulAssetFluidPreferWebp = contentfulAssetFluidPreferWebp;
const contentfulAssetFluidPreferWebpNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulFluid_withWebp_noBase64 on ContentfulFluid {
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`; // TODO: in v3 remove these legacy fragments

exports.contentfulAssetFluidPreferWebpNoBase64 = contentfulAssetFluidPreferWebpNoBase64;
const contentfulAssetResolutions = _gatsby.graphql`
  fragment GatsbyContentfulResolutions on ContentfulResolutions {
    base64
    width
    height
    src
    srcSet
  }
`;
exports.contentfulAssetResolutions = contentfulAssetResolutions;
const contentfulAssetResolutionsTracedSVG = _gatsby.graphql`
  fragment GatsbyContentfulResolutions_tracedSVG on ContentfulResolutions {
    tracedSVG
    width
    height
    src
    srcSet
  }
`;
exports.contentfulAssetResolutionsTracedSVG = contentfulAssetResolutionsTracedSVG;
const contentfulAssetResolutionsNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulResolutions_noBase64 on ContentfulResolutions {
    width
    height
    src
    srcSet
  }
`;
exports.contentfulAssetResolutionsNoBase64 = contentfulAssetResolutionsNoBase64;
const contentfulAssetResolutionsPreferWebp = _gatsby.graphql`
  fragment GatsbyContentfulResolutions_withWebp on ContentfulResolutions {
    base64
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`;
exports.contentfulAssetResolutionsPreferWebp = contentfulAssetResolutionsPreferWebp;
const contentfulAssetResolutionsPreferWebpNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulResolutions_withWebp_noBase64 on ContentfulResolutions {
    width
    height
    src
    srcSet
    srcWebp
    srcSetWebp
  }
`;
exports.contentfulAssetResolutionsPreferWebpNoBase64 = contentfulAssetResolutionsPreferWebpNoBase64;
const contentfulAssetSizes = _gatsby.graphql`
  fragment GatsbyContentfulSizes on ContentfulSizes {
    base64
    aspectRatio
    src
    srcSet
    sizes
  }
`;
exports.contentfulAssetSizes = contentfulAssetSizes;
const contentfulAssetSizesTracedSVG = _gatsby.graphql`
  fragment GatsbyContentfulSizes_tracedSVG on ContentfulSizes {
    tracedSVG
    aspectRatio
    src
    srcSet
    sizes
  }
`;
exports.contentfulAssetSizesTracedSVG = contentfulAssetSizesTracedSVG;
const contentfulAssetSizesNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulSizes_noBase64 on ContentfulSizes {
    aspectRatio
    src
    srcSet
    sizes
  }
`;
exports.contentfulAssetSizesNoBase64 = contentfulAssetSizesNoBase64;
const contentfulAssetSizesPreferWebp = _gatsby.graphql`
  fragment GatsbyContentfulSizes_withWebp on ContentfulSizes {
    base64
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`;
exports.contentfulAssetSizesPreferWebp = contentfulAssetSizesPreferWebp;
const contentfulAssetSizesPreferWebpNoBase64 = _gatsby.graphql`
  fragment GatsbyContentfulSizes_withWebp_noBase64 on ContentfulSizes {
    aspectRatio
    src
    srcSet
    srcWebp
    srcSetWebp
    sizes
  }
`;
exports.contentfulAssetSizesPreferWebpNoBase64 = contentfulAssetSizesPreferWebpNoBase64;