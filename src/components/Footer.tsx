const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-text py-12 rounded-t-3xl shadow-cute">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* 关于我们 */}
          <div className="bg-white rounded-2xl p-6 shadow-cute">
            <h3 className="text-lg font-semibold mb-4 text-primary">关于数据学院</h3>
            <p className="text-text mb-4">
              数据学院是专注于数据分析教育的在线学习平台，提供高质量的课程和实战项目，帮助学员掌握数据分析技能。
            </p>
          </div>

          {/* 快速链接 */}
          <div className="bg-white rounded-2xl p-6 shadow-cute">
            <h3 className="text-lg font-semibold mb-4 text-primary">快速链接</h3>
            <ul className="space-y-3 text-text">
              <li><a href="#" className="block py-2 hover:text-primary transition-all duration-300">首页</a></li>
              <li><a href="#courses" className="block py-2 hover:text-primary transition-all duration-300">课程</a></li>
              <li><a href="#news" className="block py-2 hover:text-primary transition-all duration-300">动态</a></li>
              <li><a href="#about" className="block py-2 hover:text-primary transition-all duration-300">关于我们</a></li>
            </ul>
          </div>

          {/* 课程分类 */}
          <div className="bg-white rounded-2xl p-6 shadow-cute">
            <h3 className="text-lg font-semibold mb-4 text-primary">课程分类</h3>
            <ul className="space-y-3 text-text">
              <li><a href="#" className="block py-2 hover:text-primary transition-all duration-300">数据可视化</a></li>
              <li><a href="#" className="block py-2 hover:text-primary transition-all duration-300">机器学习</a></li>
              <li><a href="#" className="block py-2 hover:text-primary transition-all duration-300">数据挖掘</a></li>
              <li><a href="#" className="block py-2 hover:text-primary transition-all duration-300">商业分析</a></li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div className="bg-white rounded-2xl p-6 shadow-cute">
            <h3 className="text-lg font-semibold mb-4 text-primary">联系我们</h3>
            <ul className="space-y-3 text-text">
              <li>邮箱: contact@data学院.com</li>
              <li>电话: 400-123-4567</li>
              <li>地址: 北京市海淀区中关村</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-text">
          <p>© 2026 数据学院. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer