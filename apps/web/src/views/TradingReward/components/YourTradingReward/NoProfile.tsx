import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Link, Message, MessageText, Text } from '@pancakeswap/uikit'
import { CHAIN_QUERY_NAME } from 'config/chains'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import Image from 'next/image'

const NoProfile = () => {
  const { t } = useTranslation()
  const { account, chainId } = useAccountActiveChain()

  return (
    <>
      <Text bold mb="8px">
        {t('You have no active GroFi DEX Profile.')}
      </Text>
      <Text mb="32px">{t('Create a GroFi DEX Profile to start earning from trades')}</Text>
      <Box>
        <Image src="/images/trading-reward/create-profile.png" width={420} height={128} alt="create-profile" />
      </Box>
      {chainId !== ChainId.BSC && (
        <Box maxWidth={365} mt="24px">
          <Message variant="primary">
            <MessageText>
              {t('To create GroFi DEX Profile, you will need to switch your network to BNB Chain.')}
            </MessageText>
          </Message>
        </Box>
      )}
      <Link mt="32px" external href={`/profile/${account}?chain=${CHAIN_QUERY_NAME[ChainId.BSC]}`}>
        <Button>{t('Activate Profile')}</Button>
      </Link>
    </>
  )
}

export default NoProfile
