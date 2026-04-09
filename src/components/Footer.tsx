const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 关于我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">关于数据学院</h3>
            <p className="text-gray-400 mb-4">
              数据学院是专注于数据分析教育的在线学习平台，提供高质量的课程和实战项目，帮助学员掌握数据分析技能。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">首页</a></li>
              <li><a href="#courses" className="hover:text-white">课程</a></li>
              <li><a href="#news" className="hover:text-white">动态</a></li>
              <li><a href="#about" className="hover:text-white">关于我们</a></li>
            </ul>
          </div>

          {/* 课程分类 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">课程分类</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">数据可视化</a></li>
              <li><a href="#" className="hover:text-white">机器学习</a></li>
              <li><a href="#" className="hover:text-white">数据挖掘</a></li>
              <li><a href="#" className="hover:text-white">商业分析</a></li>
            </ul>
          </div>

          {/* 联系我们 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <ul className="space-y-2 text-gray-400">
              <li>邮箱: contact@data学院.com</li>
              <li>电话: 400-123-4567</li>
              <li>地址: 北京市海淀区中关村</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>© 2026 数据学院. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer