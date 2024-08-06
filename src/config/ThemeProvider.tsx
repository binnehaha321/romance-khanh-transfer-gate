import { ConfigProvider } from 'antd'

const ThemeProvider = ({ children }: React.PropsWithChildren) => (
	<ConfigProvider
		theme={{
			token: {
				fontSize: 16
			},
			components: {
				// Input: {
				// 	fontSize: 20
				// },
			}
		}}
	>
		{children}
	</ConfigProvider>
)

export default ThemeProvider
