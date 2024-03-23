import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Card, Flex, Progress, ProgressBar, ScanLink, Tab, TabMenu, Table, Td, Text, Th } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { formatUnits } from 'ethers/lib/utils'
import { useCurrency } from 'hooks/Tokens'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useMemo, useState } from 'react'
import { ChainLinkSupportChains, multiChainId } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import styled from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { useGetHolders } from 'views/Swap/hooks/useGetHolders'

interface TAB {
  symbol: string
  address: string
}
const StyledProgress = styled(Progress)`
  width: 100%;
  border-radius: 15px;
  height: 10px;
`
export function TopHolders() {
  const {
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const { theme } = useTheme()
  const { t } = useTranslation()
  const [active, setActive] = useState<number>(0)
  const native = useNativeCurrency()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const chainName = useChainNameByQuery()
  const tabs = useMemo(() => {
    const _tabs: Array<TAB> = []
    if (inputCurrency && outputCurrency) {
      if (inputCurrency?.wrapped?.address !== native?.wrapped?.address) {
        _tabs.push({ symbol: inputCurrency?.symbol, address: inputCurrency?.wrapped?.address })
      }
      if (outputCurrency?.wrapped?.address !== native?.wrapped?.address) {
        _tabs.push({ symbol: outputCurrency?.symbol, address: outputCurrency?.wrapped?.address })
      }
    }
    return _tabs
  }, [inputCurrency, outputCurrency, native])

  const { isPending, data } = useGetHolders({ contractaddress: tabs[active]?.address })
  const getPercent = (value: string) => {
    return (Number(value) / Number(data?.token.totalSupply)) * 100
  }

  return (
    <div>
      <TabMenu activeIndex={active} onItemClick={setActive} isShowBorderBottom={false} customWidth>
        {tabs?.map((item: TAB) => (
          <Tab>{item.symbol}</Tab>
        ))}
      </TabMenu>
      <Flex maxWidth={1120} padding="10px 0" margin="auto auto 100px auto">
        <Card style={{ width: '100%' }}>
          <Table>
            <thead>
              <Th>
                <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                  {t('Address')}
                </Text>
              </Th>
              <Th>
                <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                  {t('Supply')}
                </Text>
              </Th>
              <Th width="30%" />
              <Th>
                <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                  {t('Amount')}
                </Text>
              </Th>
              {/* <Th width="15%">
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('Commission')}
              </Text>
            </Th> */}
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <Td colSpan={5} textAlign="center">
                    {t('Loading...')}
                  </Td>
                </tr>
              ) : (
                <>
                  {data?.listHolders?.map((item) => (
                    <tr key={item.address}>
                      <Td>
                        <ScanLink
                          useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
                          href={getBlockExploreLink(item.address, 'address', multiChainId[chainName])}
                        >
                          {truncateHash(item.address)}
                        </ScanLink>
                      </Td>
                      <Td>
                        <Text bold>{formatAmount(getPercent(item.value))}%</Text>
                      </Td>
                      <Td>
                        <StyledProgress variant="flat">
                          <ProgressBar
                            $useDark
                            $background={theme?.colors.primary}
                            style={{ width: `${Math.min(Math.max(getPercent(item.value), 0), 100)}%` }}
                          />
                        </StyledProgress>
                      </Td>
                      <Td>
                        <Text bold>{`${formatNumber(Number(formatUnits(item.value, data.token?.decimals)))}`}</Text>
                      </Td>
                      {/* <Td>
                      <Flex flexDirection="column">
                        <Text bold>{`~ ${formatNumber(Number(data.cakeBalance), 0)} CAKE`}</Text>
                        <Text textAlign="left" fontSize="12px" color="textSubtle">
                          {`$${formatNumber(Number(data.metric.totalEarnFeeUSD), 0)}`}
                        </Text>
                      </Flex>
                    </Td> */}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </Table>
        </Card>
      </Flex>
    </div>
  )
}
