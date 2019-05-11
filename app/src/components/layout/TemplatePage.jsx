import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Content from 'components/layout/Content';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeftOutlined';
import ChevronRightIcon from '@material-ui/icons/ChevronRightOutlined';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import Root from 'components/layout/Root';
import presets from 'components/layout/layoutPresets';
import LeftNav from 'components/layout/LeftNav';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import DefaultLeftNavHeaderContent from 'components/layout/DefaultLeftNavContentHeaderContent';
import DefaultLevNavContent from 'components/layout/DefaultLeftNavContent';
import DefaultHeaderContent from 'components/layout/DefaultHeader';

const TemplatePage = ({LeftNavHeaderContent, LeftNavContent, HeaderContent, layout, children, ...props}) => {
  const [preset] = useState(layout);

  return (
    <Root config={presets[preset]()} style={{minHeight: '100vh'}}>
      <Header
        menuIcon={{inactive: <MenuRoundedIcon/>, active: <ChevronLeftIcon/>}}
        {...props}
      >
        {({screen, collapsed}) => <HeaderContent screen={screen} collapsed={collapsed}/>}
      </Header>
      <LeftNav
        collapsedIcon={{
          inactive: <ChevronLeftIcon/>,
          active: <ChevronRightIcon/>,
        }}
        header={({collapsed}) => <LeftNavHeaderContent collapsed={collapsed} {...props}/>}
        {...props}
      >
        {({collapsed}) => <LeftNavContent collapsed={collapsed} {...props}/>}
      </LeftNav>
      <Content>
        {children}
      </Content>
      <Footer />
    </Root>
  );
};


TemplatePage.propTypes = {
  children: PropTypes.node,
  LeftNavHeaderContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  LeftNavContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  HeaderContent: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  layout: PropTypes.string,
};

TemplatePage.defaultProps = {
  LeftNavHeaderContent: DefaultLeftNavHeaderContent,
  LeftNavContent: DefaultLevNavContent,
  HeaderContent: DefaultHeaderContent,
  layout: 'createContentBasedLayout',
};

export default TemplatePage;
