import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated
} from 'react-native'
import {ToastInOutDuration, ToastInHeight} from '../data/Constants'
import { shadowBlackStyleBottom } from '../util/UiUtil'

const MaxWidthRatio = 0.8
const DefaultPadding = 10
const StylesAllow = [ 
    'padding', 
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'backgroundColor',
]
export default class ToastView extends Component{

    constructor(props) {
        super(props)

        const {width,height} = Dimensions.get('window')

        this.state = {
            deviceWidth: width,
            deviceHeight: height,
            animated: props.hasOwnProperty('animated') ? props.animated : true, // 默认显示动画
            animatedValue1: new Animated.Value(0),
            animatedValue2: new Animated.Value(0.2),

        }

        // React after 17
        Dimensions.addEventListener('change', this.onWindowChange);
    }

    componentDidMount() {
        this.onLifeCycleManage()
    }

    componentWillUnmount() {
        if (this.liftCycleAnimated) {
            this.liftCycleAnimated.stop()
            this.liftCycleAnimated = undefined
        }
        Dimensions.removeEventListener('change', this.onWindowChange);
    }

    render() {

        const containerStyle = {}
        let contentStyle = {
            opacity: this.state.animatedValue2.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, 1, 0]
            }),
            maxWidth: this.state.deviceWidth*MaxWidthRatio,
        }

        StylesAllow.map((styleKey) => {
            if(this.props.hasOwnProperty(styleKey)){
                contentStyle[styleKey] = this.props[styleKey]
            }
        })

        if (this.props.position > 0) {
            containerStyle.justifyContent = 'flex-start';
            containerStyle.top = 40
            containerStyle.bottom = 0;
            if(this.state.animated){
                contentStyle.marginTop = this.state.animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [ToastInHeight/2, 0]
                })
            };
        } else if (this.props.position == 0) {
            containerStyle.justifyContent = 'center';
            containerStyle.top = 0
            containerStyle.bottom = 0;
            if(this.state.animated){
                contentStyle.marginTop = this.state.animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [ToastInHeight, 0]
                });
            };
        } else if (this.props.position < 0) {
            containerStyle.justifyContent = 'flex-end';
            containerStyle.top = 0
            containerStyle.bottom = 40;
            if(this.state.animated){
                contentStyle.marginBottom = this.state.animatedValue1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, ToastInHeight/2]
                });
            }
        }

        let shadowStyle = {};
        if (this.props.isShowShadow) shadowStyle = shadowBlackStyleBottom;
        

        return (
            <View style={[styles.container,containerStyle]} pointerEvents="none">
                <Animated.View style={[styles.content,contentStyle,shadowStyle]}>
                    {this.props.icon}
                    <Text style={[styles.text,{color: this.props.textColor}]}>
                        {this.props.data}
                    </Text>
                </Animated.View>
            </View>
        )
    }

    onLifeCycleManage = () => {

        if (this.liftCycleAnimated) {
            this.liftCycleAnimated.stop()
            this.liftCycleAnimated = undefined
        }
        this.liftCycleAnimated = Animated.sequence([
            Animated.parallel([
                Animated.timing(
                    this.state.animatedValue1,
                    {
                        toValue: 1,
                        duration: ToastInOutDuration,
                        easing: this.props.inEasing,
                        useNativeDriver: false,
                    }
                ),
                Animated.timing(
                    this.state.animatedValue2,
                    {
                        toValue: 1,
                        duration: ToastInOutDuration,
                        useNativeDriver: false,
                    }
                ),
            ]),
            Animated.timing(
                this.state.animatedValue2,
                {
                    toValue: 1,
                    duration: this.props.duration,
                    useNativeDriver: false,
                }
            ),
            Animated.timing(
                this.state.animatedValue2,
                {
                    toValue: 2,
                    duration: ToastInOutDuration,
                    useNativeDriver: false,
                }
            )
        ])
        this.liftCycleAnimated.start()
    }

    onWindowChange = ({ window }) => {
        const {width,height} = window
        if (width != this.state.deviceWidth && height != this.state.deviceHeight) {
            this.setState({
                deviceWidth: width,
                deviceHeight: height
            })
        }
    }

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0
    },
    content: {
        borderRadius: 4,
        padding: DefaultPadding,
        alignItems: 'center'
    },
    icon: {

    },
    text: {
        fontSize: 16
    }
})

