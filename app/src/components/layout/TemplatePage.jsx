import React, {useState} from 'react';
import PropTypes from 'prop-types';
import DefaultLeftNavHeaderContent from 'components/layout/DefaultLeftNavContentHeaderContent';
import DefaultLevNavContent from 'components/layout/DefaultLeftNavContent';
import DefaultHeaderContent from 'components/layout/DefaultHeader';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import MenuRounded from '@material-ui/icons/MenuRounded';
import makeStyles from "@material-ui/core/styles/makeStyles";

import {
  Root,
  Header,
  Nav,
  Content,
  Footer,
  presets,
} from 'mui-layout';

const useHeaderStyles = makeStyles(({ palette, spacing }) => ({
  header: {
    backgroundColor: palette.primary.main
  }
}));

const TemplatePage = ({LeftNavHeaderContent = DefaultLeftNavHeaderContent,
                        LeftNavContent = DefaultLevNavContent,
                        HeaderContent = DefaultHeaderContent,
                        layout = 'createContentBasedLayout',
                        children = () => {},
                        ...props}) => {
  const {
    header: headerCss
  } = useHeaderStyles();

  const [preset] = useState(layout);
  const config = presets[preset]();
  return <Root config={config} style={{minHeight: '100vh'}}>
    <Header
      classes={{ root: headerCss }}
      renderMenuIcon={open => (open ? <ChevronLeft /> : <MenuRounded />)}
    >
      {({screen, collapsed}) => <HeaderContent screen={screen} collapsed={collapsed}/>}
    </Header>
    <Nav
      renderIcon={collapsed =>
        collapsed ? <ChevronRight /> : <ChevronLeft />
      }
    >
      {({collapsed}) => <LeftNavContent collapsed={collapsed} {...props}/>}
    </Nav>
    <Content>
      {children || <div/>}
    </Content>
    <Footer>
    </Footer>
  </Root>
};


TemplatePage.propTypes = {
  children: PropTypes.node,
  LeftNavHeaderContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  LeftNavContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  HeaderContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  layout: PropTypes.string,
};

export default TemplatePage;
