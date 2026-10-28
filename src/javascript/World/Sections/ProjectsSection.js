import * as THREE from 'three'
import Project from './Project'
import gsap from 'gsap'

export default class ProjectsSection
{
    constructor(_options)
    {
        // Options
        this.time = _options.time
        this.resources = _options.resources
        this.camera = _options.camera
        this.passes = _options.passes
        this.objects = _options.objects
        this.areas = _options.areas
        this.zones = _options.zones
        this.tiles = _options.tiles
        this.debug = _options.debug
        this.x = _options.x
        this.y = _options.y

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('projects')
            this.debugFolder.open()
        }

        // Set up
        this.items = []

        this.interDistance = 24
        this.positionRandomess = 5
        this.projectHalfWidth = 9

        this.container = new THREE.Object3D()
        this.container.matrixAutoUpdate = false
        this.container.updateMatrix()

        this.setGeometries()
        this.setMeshes()
        this.setList()
        this.setZone()

        // Add all project from the list
        for(const _options of this.list)
        {
            this.add(_options)
        }
    }

    setGeometries()
    {
        this.geometries = {}
        this.geometries.floor = new THREE.PlaneGeometry(16, 8)
    }

    setMeshes()
    {
        this.meshes = {}

        // this.meshes.boardStructure = this.objects.getConvertedMesh(this.resources.items.projectsBoardStructure.scene.children, { floorShadowTexture: this.resources.items.projectsBoardStructureFloorShadowTexture })
        this.resources.items.areaOpenTexture.magFilter = THREE.NearestFilter
        this.resources.items.areaOpenTexture.minFilter = THREE.LinearFilter
        this.meshes.boardPlane = this.resources.items.projectsBoardPlane.scene.children[0]
        this.meshes.areaLabel = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.5), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xffffff, alphaMap: this.resources.items.areaOpenTexture }))
        this.meshes.areaLabel.matrixAutoUpdate = false
    }

    setList()
    {
        const posts = [
            {
                name: 'Konnect + AWS ECS',
                date: '2025.05.01',
                category: 'CLOUD / API GATEWAY',
                titleLines: ['Building an API Gateway', 'Environment with Konnect', '+ AWS ECS'],
                href: 'https://wenhan.blog/en/posts/20250501_konnect_ecs_gui/'
            },
            {
                name: 'Kong Serverless',
                date: '2025.04.15',
                category: 'KONG / AUTOMATION',
                titleLines: ['Make Request Processing', 'Smarter with Kong’s', 'Serverless Feature'],
                href: 'https://wenhan.blog/en/posts/20250415_kong_serverless/'
            },
            {
                name: 'Kong + GraphQL',
                date: '2025.03.25',
                category: 'KONG / GRAPHQL',
                titleLines: ['Accessing and Managing', 'GraphQL APIs with Kong', 'Gateway'],
                href: 'https://wenhan.blog/en/posts/20250325_kong_graphql_mngm/'
            },
            {
                name: 'Kong mTLS',
                date: '2024.12.24',
                category: 'KONG / SECURITY',
                titleLines: ['Kong Gateway', 'Introduction: mTLS', 'Support'],
                href: 'https://wenhan.blog/en/posts/20241224_kong_101_mtls/'
            },
            {
                name: 'Kong Caching',
                date: '2024.12.06',
                category: 'KONG / PERFORMANCE',
                titleLines: ['Kong Gateway', 'Introduction: Boosting', 'Performance with Caching'],
                href: 'https://wenhan.blog/en/posts/20241206_kong_101_proxy_caching/'
            }
        ]

        this.list = posts.map((_post) => ({
            name: _post.name,
            imageSources: [this.createArticleCover(_post)],
            floorTexture: this.createArticleFloorTexture(_post),
            link: {
                href: _post.href,
                x: - 4.8,
                y: - 3,
                halfExtents: { x: 3.2, y: 1.5 }
            }
        }))
    }

    createArticleCover(_post)
    {
        const escapeXml = (_value) => _value.replace(/[&<>"']/g, (_character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&apos;'
        }[_character]))
        const title = _post.titleLines.map((_line, _index) =>
            `<text x="56" y="${240 + _index * 68}" fill="#ffffff" font-family="Arial, sans-serif" font-size="56" font-weight="700">${escapeXml(_line)}</text>`
        ).join('')
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512"><rect width="1024" height="512" fill="#2e2e33"/><path d="M56 114H968" stroke="#ffbd59" stroke-width="4"/><text x="56" y="72" fill="#ffbd59" font-family="Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="5">WENHAN BLOG</text><text x="968" y="72" fill="#ffffff" font-family="Arial, sans-serif" font-size="24" text-anchor="end">${_post.date}</text>${title}<text x="56" y="466" fill="#c8c8ce" font-family="Arial, sans-serif" font-size="22" letter-spacing="3">${escapeXml(_post.category)}</text><text x="968" y="466" fill="#ffbd59" font-family="Arial, sans-serif" font-size="22" text-anchor="end">READ ARTICLE ↗</text></svg>`

        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    }

    createArticleFloorTexture(_post)
    {
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 512
        const context = canvas.getContext('2d')
        context.fillStyle = '#000000'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.fillStyle = '#ffffff'
        context.textBaseline = 'top'
        context.font = '700 34px Arial, sans-serif'
        context.fillText('WENHAN BLOG', 24, 18)
        context.font = '700 30px Arial, sans-serif'
        context.fillText(_post.date, 790, 18)
        context.font = '700 42px Arial, sans-serif'
        context.fillText(_post.category, 24, 104)
        context.font = '700 48px Arial, sans-serif'
        _post.titleLines.forEach((_line, _index) =>
        {
            context.fillText(_line, 24, 194 + _index * 76, 960)
        })

        return new THREE.CanvasTexture(canvas)
    }

    setZone()
    {
        const totalWidth = this.list.length * (this.interDistance / 2)

        const zone = this.zones.add({
            position: { x: this.x + totalWidth - this.projectHalfWidth - 6, y: this.y },
            halfExtents: { x: totalWidth, y: 12 },
            data: { cameraAngle: 'projects' }
        })

        zone.on('in', (_data) =>
        {
            this.camera.angle.set(_data.cameraAngle)
            gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: 0, duration: 2 })
            gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: 0, duration: 2 })
        })

        zone.on('out', () =>
        {
            this.camera.angle.set('default')
            gsap.to(this.passes.horizontalBlurPass.material.uniforms.uStrength.value, { x: this.passes.horizontalBlurPass.strength, duration: 2 })
            gsap.to(this.passes.verticalBlurPass.material.uniforms.uStrength.value, { y: this.passes.verticalBlurPass.strength, duration: 2 })
        })
    }

    add(_options)
    {
        const x = this.x + this.items.length * this.interDistance
        let y = this.y
        if(this.items.length > 0)
        {
            y += (Math.random() - 0.5) * this.positionRandomess
        }

        // Create project
        const project = new Project({
            time: this.time,
            resources: this.resources,
            objects: this.objects,
            areas: this.areas,
            geometries: this.geometries,
            meshes: this.meshes,
            debug: this.debugFolder,
            x: x,
            y: y,
            ..._options
        })

        this.container.add(project.container)

        // Add tiles
        if(this.items.length >= 1)
        {
            const previousProject = this.items[this.items.length - 1]
            const start = new THREE.Vector2(previousProject.x + this.projectHalfWidth, previousProject.y)
            const end = new THREE.Vector2(project.x - this.projectHalfWidth, project.y)
            const delta = end.clone().sub(start)
            this.tiles.add({
                start: start,
                delta: delta
            })
        }

        // Save
        this.items.push(project)
    }
}
