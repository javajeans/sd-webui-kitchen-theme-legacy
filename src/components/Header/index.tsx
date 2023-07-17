import { BoldOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import { useResponsive } from 'antd-style';
import qs from 'query-string';
import { type ReactNode, memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';

import { DraggablePanel } from '@/components';
import { useAppStore } from '@/store';

import Logo from './Logo';
import Nav from './Nav';
import Setting from './Setting';
import { civitaiLogo, themeIcon } from './style';

/******************************************************
 *********************** Style *************************
 ******************************************************/

const HeaderView = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;

  height: var(--fill-available);
  padding: 16px 24px;
`;

/******************************************************
 ************************* Dom *************************
 ******************************************************/

interface HeaderProps {
  children: ReactNode;
}

const Header = memo<HeaderProps>(({ children }) => {
  const [themeMode] = useAppStore((st) => [st.themeMode], shallow);
  const { mobile } = useResponsive();
  const [expand, setExpand] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (mobile) setExpand(false);
  }, []);

  const handleSetTheme = useCallback(() => {
    const theme = themeMode === 'light' ? 'dark' : 'light';
    const gradioURL = qs.parseUrl(window.location.href);
    gradioURL.query.__theme = theme;
    window.location.replace(qs.stringifyUrl(gradioURL));
  }, [themeMode]);

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      <DraggablePanel
        defaultSize={{ height: 'auto' }}
        expand={expand}
        minHeight={64}
        onExpandChange={setExpand}
        placement="top"
      >
        <HeaderView id="header" style={{ flexDirection: mobile ? 'column' : 'row' }}>
          <a href="https://www.vedegpt.com" rel="noreferrer" target="_blank">
            <Logo themeMode={themeMode} />
          </a>
          <Nav />
          {children}

          <Space.Compact>
            <a href="https://models.vedegpt.com/" rel="noreferrer" target="_blank">
              <Button icon={civitaiLogo} title="更多模型" />
            </a>
            <a href="https://svg.vedegpt.com" rel="noreferrer" target="_blank">
              <Button icon={<BoldOutlined />} title="矢量化" />
            </a>
            <Button icon={<LinkOutlined />} onClick={showModal} title="VedeGPT" />
            <Setting />
            <Button icon={themeIcon[themeMode]} onClick={handleSetTheme} title="Switch Theme" />
          </Space.Compact>
        </HeaderView>
      </DraggablePanel>
      <Modal
        footer={false}
        onCancel={handleCancel}
        open={isModalOpen}
        title={
          <a href="http://chat.vedegpt.com" rel="noreferrer" target="_blank">
            <Space>
              <LinkOutlined />
              {'私人定制的ChatGPT'}
            </Space>
          </a>
        }
      >
        {/* <Giscus themeMode={themeMode} /> */}
      </Modal>
    </>
  );
});

export default Header;
